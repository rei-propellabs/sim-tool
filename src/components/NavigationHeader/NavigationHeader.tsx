
import React, { ReactElement } from 'react';
import styles from './NavigationHeader.module.css';
import { Arrow } from "images/Dynamic/Arrow";

import { useNavigate } from "react-router-dom";

export interface NavigationHeaderProps {
  heading: string;
  tabs?: Array<{ label: string; icon: React.ReactNode }>;
  tabIndex?: number; 
  setTabIndex?: (index: number) => void;
  backText?: string;
  onBackClick?: () => void;
  companyInfo?: any[]; // todo: define type
  actionButtons?: React.ReactNode;
  headingSecondary?: string;
  subheading?: string;
  subheadingSecondary?: string;
}

export const NavigationHeader = (props: NavigationHeaderProps) => {
  const navigate = useNavigate();

  const mockProjectInfo =
    [
      { name: "SITES", details: "3" },
      { name: "LAST UPDATE", details: "4/4/18" },
      { name: "DUE", details: "4/4/18" },
      { name: "DATA STATUS", details: "Labelling" },
      { name: "PROJECT STATUS", details: "Overdue" }
    ]

  const tabs = () => {
    if (!props.tabs || props.tabs.length === 0) return null;
    return (
      <div className={styles.tabs}>
        {props.tabs.map((tab, index) => {
          return (
            <button
              key={index}
              className={`${styles.tab} ${props.tabIndex === index ? styles.activeTab : ''}`}
              onClick={() => props.setTabIndex && props.setTabIndex(index)}
            >
              {<span className={styles.tabIcon}>{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
    )
  }

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerLeft}>
        <button
          style={{ visibility: props.backText ? "visible" : "hidden" }}
          className={styles.backBtn}
          onClick={props.onBackClick ?? (() => navigate(-1))}>
          <Arrow color={"var(--darker-text)"} />
          {props.backText}
        </button>

        <div className={styles.subheading}
          style={{ visibility: props.subheading ? "visible" : "hidden" }}
        >
          {props.subheading}
          <span className={styles.darkText}>
            {props.subheadingSecondary}
          </span>
        </div>

        <div className={styles.headingContainer}>
          <div className={styles.headerText}>{props.heading}
            <span className={styles.darkText}>
            {props.headingSecondary}
          </span></div>
          {
            <div className={styles.siteInfo}>

              {props.companyInfo &&
                mockProjectInfo.map((info, index) => (
                  <div className={styles.siteInfoSec} key={index}>
                    <div className={styles.siteInfoTitle}>{info.name}</div>
                    <div className={styles.siteInfoDetails}>{info.details}</div>
                  </div>))}
            </div>}

          {
            props.actionButtons && 
            (
              <div style={{marginBottom: 8}}>
                {props.actionButtons}
              </div>
            )
          }
          { tabs() }
        </div>
      </div>

    </div>
  );
}