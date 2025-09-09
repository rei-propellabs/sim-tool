export const NumHolesLabels = ["35-49", "50-59", "60-69", "70-79", "80-90"];

export interface ScenarioData {
	id: string;
	name: string;
	isChosen: boolean;
	hasAllFiles: boolean;
	importNumber: number;
	order: number;
	simulation: number;
	run: number;
	path: string;
	cashflow: {
		yearly: CashflowEntry[];
		quarterly: CashflowEntry[];
		monthly: CashflowEntry[];
	};
	collar: CollarEntry[];
	financial: FinancialData;
	operational: OperationalData;
	parameters: ParametersData;
	evaluationParameters: EvaluationParameters;
	extractionGeometry: ExtractionGeometry;
	metals: MetalEntry[];
	processStreams: ProcessStreamEntry[];
	projectMetadata: ProjectMetadata;
	untransform: UntransformData;
	projectId: string;
	createdAt: string;
	updatedAt: string;
}

export interface CashflowEntry {
	goldCost: number;
	wasteCost: number;
	miningCost: number;
	netRevenue: number;
	goldRevenue: number;
	grossRevenue: number;
	wasteRevenue: number;
	periodBeginning: string;
	beneficiationCost: number;
	totalProcessingCost: number;
	beneficiationRevenue: number;
}

export interface CollarEntry {
	dia: number;
	depth: number;
	serial: number;
	azimuth: number;
	bottomX: number;
	bottomY: number;
	bottomZ: number;
	collarX: number;
	collarY: number;
	collarZ: number;
	goldVol: number;
	goldAuKg: number;
	goldMass: number;
	netValue: number;
	wasteVol: number;
	goldAuPpm: number;
	wasteAuKg: number;
	wasteMass: number;
	wasteAuPpm: number;
	inclination: number;
	beneficiationVol: number;
	beneficiationMass: number;
}

export interface FinancialData {
	aisc: number;
	capex: number;
	revenue: number;
	allInCost: number;
	miningCost: number;
	closureCost: number;
	imagingCost: number;
	netCashFlow: number;
	revenueMeter: number;
	revenueTonne: number;
	cashFlowMeter: number;
	allInCostMeter: number;
	allInCostTonne: number;
	extractionCost: number;
	closureCostTonne: number;
	imagingCostTonne: number;
	netCashFlowTonne: number;
	processingCostOre: number;
	extractionCostTonne: number;
	processingCostWaste: number;
	totalProcessingCost: number;
	totalProcessingCostTonne: number;
}

export interface OperationalData {
	lom: number;
	grade: number;
	oreMass: number;
	goldCost: number;
	goldMass: number;
	wasteMass: number;
	totalLength: number;
	goldCostTonne: number;
	holeLengthAvg: number;
	holeLengthMax: number;
	holeLengthMin: number;
	extractionHoles: number;
	holeInclinationAvg: number;
	holeInclinationMax: number;
	holeInclinationMin: number;
	totalCommodityVolume: number;
	quantityOfHolesPerInclination: number[];
}

export interface ParametersData {
	availability: number;
	discountRate: number;
	millRecovery: number;
	commodityPrice: number;
	cutterHeadSize: number;
	numberOfDrills: number;
	maximumHoleLength: number;
	rateOfPenetration: number;
	wasteCostPerTonne: number;
	minimumHoleInclination: number;
	processingCostPerTonne: number;
	baselineMiningCostPerTonne: number;
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

export interface MetalEntry {
	per: string;
	name: string;
	unit: string;
	price: number;
	fields: MetalFields;
}

export interface MetalFields {
	per: string;
	vol: string;
	cost: string;
	mass: string;
	unit: string;
	revenue: string;
	wastePer: string;
	wasteUnit: string;
}

export interface ProcessStreamEntry {
	cost: number;
	name: string;
	maxRate: number | null;
	auRecovery: number;
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

export interface UntransformData {
	matrix: number[][];
	multiplier: number;
}
