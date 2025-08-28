import React, { useEffect, useState } from 'react';
import styles from './EditCompanyPage.module.css';
import { TopBar } from "components/TopBar/TopBar";
import { DateInput } from "components/DateInput/DateInput";
import Plus from "images/Plus.svg";
import MenuDots from "images/MenuDots.svg";
import WarningIcon from "images/Warning.svg";
import { PopupMenu } from "components/ProjectTable/PopupMenu";
import Delete from "images/Delete.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "config";
import { Company } from "api/models/Company";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import useGetOrganizationById from "api/hooks/useGetOrganizationById";
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import usePostUser, { PostUserPayload } from "api/hooks/usePostUser";
import useInviteUser from "api/hooks/useInviteUser";
import usePostCompany from "api/hooks/usePostCompany";
import useListUserAccess from "api/hooks/useListUserAccesses";
import { getToken } from "utils/TokenManager";
import { isValidEmail } from "utils/Validate";
import usePutUser from "api/hooks/usePutUser";
import { User } from "api/models/User";
import useDeleteUser from "api/hooks/useDeleteUser";

export const EditCompanyPage = () => {
  const [orgName, setOrgName] = useState<string>("");
  const [mainContact, setMainContact] = useState<string>("");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [existingUserAccess, setExistingUserAccess] = useState<string[]>([]);

  const [newUserAccess, setNewUserAccess] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ isNew: boolean, index: number } | undefined>();
  const [emailError, setEmailError] = useState<string>("");
  const [emailValidationErrors, setEmailValidationErrors] = useState<{[key: number]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [userAccessMenuOpen, setUserAccessMenuOpen] = useState(false);
  const [menuButtonRef, setMenuButtonRef] = React.useState<React.RefObject<HTMLButtonElement> | null>(null);
  const menuButtonRefs = React.useRef<Array<React.RefObject<HTMLButtonElement>>>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [deleteUsers, setDeleteUsers] = useState<{email: string, userId: string}[]>([]);

  const navigate = useNavigate();
  const token = getToken("uploadAdmin")
  const { postUser } = usePostUser(token);
  const { deleteUser } = useDeleteUser(token);
  const { inviteUser } = useInviteUser(token);
  const { postCompany } = usePostCompany(token);
  const { putUser } = usePutUser(token);

  const query = new URLSearchParams(useLocation().search);
  const orgId = query.get("orgId");
  const isEditing = orgId != null && orgId?.length > 0

  const { isLoading: isLoadingOrg, organization } = useGetOrganizationById(token, orgId || undefined);
  const { isLoading: isLoadingUsers, users } = useListUserAccess(token, orgId || undefined, true)

  useEffect(() => {
    if (!isLoadingOrg && organization) {
      console.log(organization)

      setOrgName(organization.name || "");
      setRegion(organization.region || "");
      setStartDate(organization.engagementStartDate ? new Date(organization.engagementStartDate) : null);
      setMainContact(organization.settings?.mainContact || "");
      setAdminEmail(organization.settings?.adminEmail || "");
    }
  }, [isLoadingOrg])

  useEffect(() => {
    if (!isLoadingUsers && users) {
      setExistingUserAccess(users.map((u) => u.email))

    }
  }, [isLoadingUsers])

  const header = () => {
    return (
      <NavigationHeader
        backText="BACK TO COMPANIES"
        onBackClick={() => { navigate("/admin") }}
        heading={isEditing ? `Edit Company` : "New Company"}
      />
    )
  }

  const handleAddAccess = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setNewUserAccess([...newUserAccess, ""]);
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!isValidEmail(adminEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    } else {
      setEmailError("");
    }

    setIsSubmitting(true);

    try {
      const token = getToken("uploadAdmin")
      if (!token) {
        setIsSubmitting(false);
        return;
      }

      if (isEditing) {
        const body = {
          "id": orgId,
          "name": orgName,
          "settings": {
            mainContact: mainContact,
            adminEmail: adminEmail,
          }
        }

        // If the admin email is new, add to the new user access list
        if (adminEmail && !existingUserAccess.includes(adminEmail) &&
           !newUserAccess.includes(adminEmail)
          ) {
            newUserAccess.push(adminEmail)
        }

        // If there is an email that are both in newUserAccess and deleteUsers, add it to ignore list
        const ignoreEmails = newUserAccess.filter(email => deleteUsers.some(({ email: delEmail }) => delEmail.trim().toLowerCase() === email.trim().toLowerCase()));
        console.log("Ignore emails:", ignoreEmails);

        await Promise.all(
          [...newUserAccess
            .filter((email) => email.trim().length > 0 && !ignoreEmails.includes(email.trim().toLowerCase()))
            .map((email) =>
            postUser({
              email: email,
              organizationId: orgId,
              name: "",
              sendInvite: true,
            })
          ),
          ...deleteUsers
            .filter(({ email, userId }) =>
              email.trim().length > 0 && 
              !ignoreEmails.includes(email.trim().toLowerCase()) && 
              email !== adminEmail)
            .map(({ email, userId }) => deleteUser(orgId, userId)),
          postCompany(body)]
        );

        // todo: error handling. also, handle saving the data.
        navigate(-1);

      } else {
        const body = {
          "name": orgName,
          "isAdmin": true,
          "settings": {
            mainContact: mainContact,
            adminEmail: adminEmail,
          }
        }

        const result = await postCompany(body);
        if (typeof result !== "string") {
          const newCompany: Company = result;

          if (adminEmail && !newUserAccess.includes(adminEmail)) {
            newUserAccess.push(adminEmail)
          }
          await Promise.all([
            ...newUserAccess
              .filter((email) => email.trim().length > 0 && email.trim().toLowerCase() !== adminEmail.toLowerCase())
              .map((email) =>
                postUser({
                  email: email.trim(),
                  organizationId: newCompany.id,
                  name: "",
                  sendInvite: true,
                })
              )]
          );
          navigate(-1);
        } 
      }

    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(`${err.message || "Failed to submit."}`);
      // Handle error appropriately
      console.error("Error submitting form:", err);
    }
  }

  // Helper to find duplicate indices in both arrays
  const getDuplicateIndices = () => {
    const all = [...existingUserAccess, ...newUserAccess];
    const seen = new Map<string, number[]>();
    all.forEach((email, idx) => {
      if (!email) return;
      if (!seen.has(email)) seen.set(email, []);
      seen.get(email)!.push(idx);
    });
    // Only return indices for emails that appear more than once
    return Array.from(seen.values()).filter(indices => indices.length > 1);
  };
  const duplicateIndicesAll = getDuplicateIndices();

  const handleRemoveAccess = async (index: number) => {
    if (!users || !orgId) return;

    const selectedUser = users[index];
    if (orgId && users) {
      try {
        setErrorMessage("");

        deleteUsers.push({ email: selectedUser.email, userId: selectedUser.id });
        // remove from the users list
        setExistingUserAccess((prev) => {
          const updated = [...prev];
          updated.splice(index, 1);
          return updated;
        });
      } catch (e: any) {
        console.error("Error removing user access", e);

        let errorMsg = "Failed to remove user access";
        if (e.message) {
          errorMsg = e.message;
        } else if (typeof e === 'string') {
          errorMsg = e;
        }
        setErrorMessage(errorMsg);

      }

      handlePopupMenuClose();
    }
  }
  const userAccessEntry = (index: number, isNew: boolean) => {
    const refIndex = isNew ? existingUserAccess.length + index : index;

    if (!menuButtonRefs.current[refIndex]) {
      menuButtonRefs.current[refIndex] = React.createRef<HTMLButtonElement>();
    }

    const thisButtonRef = menuButtonRefs.current[refIndex];

    let warning = ""
    // Check if this is the last occurrence of a duplicate (across both arrays)
    let showWarning = false;
    if (isNew) {
      for (const indices of duplicateIndicesAll) {
        if (indices.includes(existingUserAccess.length + index) && indices[indices.length - 1] === existingUserAccess.length + index) {
          showWarning = true;
          warning = "This email address was already entered";
          break;
        }
      }
    }

    // Show validation error if it exists for this input
    if (isNew && emailValidationErrors[index]) {
      showWarning = true;
      warning = emailValidationErrors[index];
    }

    if (emailValidationErrors[index] && isValidEmail(newUserAccess[index])) {
      setEmailValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    
    }

    return (
      <div key={refIndex}>
        <div className={styles.userAccessInputContainer}>
          <input type="text"
            className={styles.userAccessInput}
            value={isNew ? newUserAccess[index] : existingUserAccess[index]}
            readOnly={!isNew}
            onChange={(e) => setNewUserAccess(() => {
              const updated = [...newUserAccess];
              updated[index] = e.target.value;
              return updated;
            })}
            onBlur={(e) => {
              if (isNew) {
                const value = e.target.value;
                if (value && !isValidEmail(value)) {
                  setEmailValidationErrors(prev => ({
                    ...prev,
                    [index]: "Make sure the email address format is valid"
                  }));
                } else {
                  setEmailValidationErrors(prev => {
                    const updated = { ...prev };
                    delete updated[index];
                    return updated;
                  });
                }
              }
            }}
            placeholder="" />
          <button className={styles.userAccessMenu}
            ref={thisButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setUserAccessMenuOpen(true);
              setMenuButtonRef(thisButtonRef);
              setSelectedUser({ isNew, index });
            }}>
            <img src={MenuDots} />
          </button>

        </div>
        {showWarning && (
          <div className={styles.errorText} style={{ marginTop: 2 }}>
            <img src={WarningIcon} alt="Warning" />{warning}
          </div>
        )}
      </div>
    )
  }

  const handlePopupMenuClose = () => {
    setUserAccessMenuOpen(false);
    setSelectedUser(undefined);
  };

  return (
    <div className={styles.pageContainer}>

      {
        !isEditing &&
        <>
          <TopBar />
          {header()}
        </>
      }
      {
        isLoadingOrg ?
          <SmallLoadingSpinner />
          :
          <div className={styles.formContainer}>
            <div className={styles.title}>General</div>

            <div className={styles.fieldDetails}>
              Company name
              <input type="text"
                readOnly={isEditing}
                className={styles.inputField}
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="" />
            </div>

            <div className={styles.row}>
              <div className={styles.fieldDetails}>
                Main contact
                <input type="text"
                  className={styles.inputField}
                  value={mainContact}
                  onChange={(e) => setMainContact(e.target.value)}
                  placeholder="" />
              </div>

              <div className={styles.fieldDetails}>
                Email
                <input type="text"
                  className={styles.inputField}
                  value={adminEmail}
                  onChange={(e) => {
                    setAdminEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="" />
                {emailError && (
                  <div className={styles.errorText}>
                    <img src={WarningIcon} alt="Warning" />
                    {emailError}
                  </div>
                )}
              </div>
            </div>

            {/* <div className={styles.fieldDetails}>
              Engagement Start Date

              <div className={styles.dateInput}>
                <DateInput selected={startDate} onChange={(date) => setStartDate(date)} />

              </div>
            </div> */}

            {/* <div className={styles.fieldDetails}>
              Region
              <input type="text"
                className={styles.inputField}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="" />
            </div> */}

            {
              <div className={styles.fieldDetails}>
                Upload Center accesses
                {
                  existingUserAccess.length > 0 &&
                  existingUserAccess.map((access, index) => {
                    return (
                      userAccessEntry(index, false)
                    )
                  })
                }
                {
                  newUserAccess.length > 0 &&
                  newUserAccess.map((access, index) => {
                    return (
                      userAccessEntry(index, true)
                    )
                  })
                }

                <div className={styles.addBtnContainer}>
                  <button className={styles.addBtn}
                    disabled={newUserAccess.length > 0 && (!newUserAccess[newUserAccess.length - 1] || !isValidEmail(newUserAccess[newUserAccess.length - 1]))}
                    onClick={handleAddAccess}>
                    <img src={Plus} />Add access
                  </button>
                </div>

              </div>
            }

            <div className={styles.errorText} style={{ marginTop: 2 }}>
              {errorMessage && <img src={WarningIcon} alt="Warning" />}
            {errorMessage}
            </div>

            <button
              type="submit"
              disabled={!orgName.length || mainContact.length === 0 || adminEmail.length === 0 || isSubmitting}
              className={styles.submitBtn}
              onClick={handleSubmit}>
              {isEditing ? "Save" : "Submit"}
            </button>
            <PopupMenu
              open={userAccessMenuOpen}
              anchorRef={menuButtonRef ?? { current: null }}
              onClose={() => {
                handlePopupMenuClose()
              }}
              style={{
                top: menuButtonRef?.current ? menuButtonRef?.current.getBoundingClientRect().top - 4 : 0,
                left: menuButtonRef?.current ? menuButtonRef.current.getBoundingClientRect().right + 8 : 0,
              }}
            >
              {
                selectedUser && (
                  !selectedUser.isNew ?
                    (
                      <>
                        <button className={`buttonNoBg ${styles.option}`}
                          onClick={() => {
                            if (orgId && users) {
                              //inviteUser({ organizationId: orgId, id: users[selectedUser.index].id })
                              postUser({
                                email: users[selectedUser.index].email,
                                organizationId: orgId,
                                name: "",
                                sendInvite: true
                              })
                              handlePopupMenuClose();
                            }
                          }}>
                          Resend Invite
                        </button>
                        <button
                          className={`buttonNoBg ${styles.option} ${styles.deleteOption}`}
                          onClick={() => handleRemoveAccess(selectedUser.index)}>
                          <img src={Delete} />
                          Remove access
                        </button>
                      </>
                    )
                    :
                    // it's a new user that hasn't been created yet. just remove the entry locally
                    <button className={`buttonNoBg ${styles.option} ${styles.deleteOption}`}
                      onClick={() => {
                        console.log("Removing access for", newUserAccess[selectedUser.index]);
                        setNewUserAccess((prev) => {
                          const updated = [...prev];
                          updated.splice(selectedUser.index, 1);
                          return updated;
                        });
                        handlePopupMenuClose();
                      }}>
                      <img src={Delete} />
                      Remove access
                    </button>
                )
              }
            </PopupMenu>
          </div>
      }

    </div>
  )
}