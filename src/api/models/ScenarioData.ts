export const NumHolesLabels = ["35-49", "50-59", "60-69", "70-79", "80-90"];

export interface ScenarioResponse{
	scenarios: ScenarioData[];
	total: number;
}

export interface ScenarioData {
	id: string;
	name: string;
	isChosen: boolean;
	hasAllFiles: boolean;
	filesInfo: FilesInfo;
	importNumber: number;
	order: number;
	simulation: number;
	run: number;
	path: string;
	cashflow: Cashflow;
	collar: Collar[];
	composite: Composite[];
	financial: Financial;
	operational: Operational;
	parameters: Parameters;
	evaluationParameters: EvaluationParameters;
	extractionGeometry: ExtractionGeometry;
	metals: Metal[];
	streams: Stream[];
	projectMetadata: ProjectMetadata;
	untransform: Untransform;
	grade: Grade;
	projectId: string;
	createdAt: string;
	updatedAt: string;
	presentationId: string;
}

export interface FilesInfo {
	grade: FileStatus;
	collar: FileStatus;
	cashflow: FileStatus;
	composite: FileStatus;
	parameters: FileStatus;
}

export interface FileStatus {
	exists: boolean;
	missingFields: string[];
}

export interface Cashflow {
	yearly: CashflowPeriod[];
	monthly: CashflowPeriod[];
	quarterly: CashflowPeriod[];
}

export interface CashflowPeriod {
	REEsCost: number;
	WasteCost: number;
	miningCost: number;
	netRevenue: number;
	REEsRevenue: number;
	WasteRevenue: number;
	grossRevenue: number;
	periodBeginning: string;
	totalProcessingCost: number;
}

export interface Collar {
	dia: number;
	depth: number;
	serial: number;
	REEsVol: number;
	azimuth: number;
	bottomX: number;
	bottomY: number;
	bottomZ: number;
	collarX: number;
	collarY: number;
	collarZ: number;
	REEsMass: number;
	WasteVol: number;
	netValue: number;
	WasteMass: number;
	REEsDy2O3Kg: number;
	REEsNd2O3Kg: number;
	inclination: number;
	REEsDy2O3Pct: number;
	REEsNd2O3Pct: number;
	REEsPr6O11Kg: number;
	WasteDy2O3Kg: number;
	WasteNd2O3Kg: number;
	REEsPr6O11Pct: number;
	WasteDy2O3Pct: number;
	WasteNd2O3Pct: number;
	WastePr6O11Kg: number;
	bottomRenderX: number;
	bottomRenderY: number;
	bottomRenderZ: number;
	collarRenderX: number;
	collarRenderY: number;
	collarRenderZ: number;
	WastePr6O11Pct: number;
}

export interface Composite {
	month: number;
	miningCost: number;
	Dy2O3KgSold: number;
	Nd2O3KgSold: number;
	netCashFlow: number;
	tonnesMined: number;
	Dy2O3Revenue: number;
	Nd2O3Revenue: number;
	Pr6O11KgSold: number;
	totalRevenue: number;
	Pr6O11Revenue: number;
	REEsProcessingCost: number;
	REEsTonnesProcessed: number;
	WasteProcessingCost: number;
	totalProcessingCost: number;
	WasteTonnesProcessed: number;
}

export interface Financial {
	capex: number;
	monthly: FinancialMonthly[];
	revenue: number;
	allInCost: number;
	miningCost: number;
	closureCost: number;
	imagingCost: number;
	netCashFlow: number;
	revenueTonne: number;
	allInCostTonne: number;
	extractionCost: number;
	closureCostTonne: number;
	imagingCostTonne: number;
	netCashFlowTonne: number;
	extractionCostTonne: number;
	totalProcessingCost: number;
	totalProcessingCostTonne: number;
}

export interface FinancialMonthly {
	month: number;
	metals: FinancialMetal[];
	streams: FinancialStream[];
	miningCost: number;
	Dy2O3KgSold: number;
	Nd2O3KgSold: number;
	netCashFlow: number;
	tonnesMined: number;
	Dy2O3Revenue: number;
	Nd2O3Revenue: number;
	Pr6O11KgSold: number;
	totalRevenue: number;
	Pr6O11Revenue: number;
	REEsProcessingCost: number;
	REEsTonnesProcessed: number;
	WasteProcessingCost: number;
	totalProcessingCost: number;
	WasteTonnesProcessed: number;
	[key: string]: number | FinancialMetal[] | FinancialStream[];

}

export interface FinancialMetal {
	name: string;
	sold: number;
	revenue: number;
}

export interface FinancialStream {
	name: string;
	processingCost: number;
	tonnesProcessed: number;
}

export interface Operational {
	lom: number;
	totalLength: number;
	holeLengthAvg: number;
	holeLengthMax: number;
	holeLengthMin: number;
	extractionHoles: number;
	holeInclinationAvg: number;
	holeInclinationMax: number;
	holeInclinationMin: number;
	quantityOfHolesPerInclination: number[];
}

export interface Parameters {
	availability: number;
	discountRate: number;
	millRecovery: number;
	commodityPrice: number;
	cutterHeadSize: number;
	numberOfDrills: number;
	maximumHoleLength: number;
	rateOfPenetration: number;
	minimumHoleInclination: number;
	processingCostPerTonne: number;
}

export interface EvaluationParameters {
	discRate: number;
	fillName: string;
	numFills: number;
	drillName: string;
	numDrills: number;
	startDate: string;
	depthLimit: number;
	costPerHole: number;
	respectNoEntry: number;
}

export interface ExtractionGeometry {
	bitDia: number;
	xrTheta: number;
	inclSegs: number;
	maxDepth: number;
	advanceIncr: number;
	arealSamples: number;
	inclinations: number[];
	resamplePrecision: number;
}

export interface Metal {
	per: string;
	name: string;
	unit: string;
	price: number;
	streams: MetalStream[];
}

export interface MetalStream {
	mass: number;
	name: string;
	unit: number;
	grade: number;
	recovery: number;
	commodity: number;
}

export interface Stream {
	vol: number;
	cost: number;
	mass: number;
	name: string;
	maxRate: number | null;
	revenue: number;
	costTonne: number;
}

export interface ProjectMetadata {
	name: string;
	notes: string;
	client: string;
	created: string;
	topoSource: string;
	blocksDeleted: number;
	preRotateAxes: string[];
	initAppVersion: string;
	blocksDiscarded: number;
	preRotateAngles: number[];
	blockmodelSource: string;
	truncatedToDepth: number | null;
	topoDupesResolved: number;
	appliedSubdivisions: number[];
	topoDupesMaxDiscrep: number;
	detectedSubdivisions: number[];
	detectedParentBlockSz: number[];
	detectedSubblockScheme: string[];
}

export interface Untransform {
	matrix: number[][];
	multiplier: number;
}

export interface Grade {
	mined: GradeMetal[];
	processed: GradeProcessed[];
}

export interface GradeMetal {
	name: string;
	grade: number;
}

export interface GradeProcessed {
	name: string;
	metals: GradeMetal[];
}

export interface ScenarioData { }