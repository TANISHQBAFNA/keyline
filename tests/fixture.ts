import mockFile from "@/mock/acme-pay.file.json";
import mockVariables from "@/mock/acme-pay.variables.json";
import { adaptFigmaRestFile } from "@/core/ingestion";
import { buildGraph } from "@/core/transform";
import { computeAnalytics, indexGraph } from "@/core/query";

export const FILE_KEY = "TESTKEY";
const FROZEN_TIME = "2026-01-01T00:00:00.000Z";

export const sourceDocument = adaptFigmaRestFile({
  fileKey: FILE_KEY,
  file: mockFile,
  variables: mockVariables,
  kind: "mock",
  ingestedAt: FROZEN_TIME,
});

export const graph = buildGraph(sourceDocument, { builtAt: FROZEN_TIME });
export const index = indexGraph(graph);
export const analytics = computeAnalytics(index);

/** Graph ids for entities the tests reference by hand. */
export const ids = {
  file: `file:${FILE_KEY}`,
  pageCover: "node:0:1",
  pageOnboarding: "node:10:1",
  pagePayments: "node:20:1",
  pageDesignSystem: "node:30:1",

  sectionSignUp: "node:10:2",
  sectionCheckout: "node:20:2",
  sectionCore: "node:30:2",
  sectionPatterns: "node:30:3",

  frameCover: "node:1:1",
  frameWelcome: "node:10:10",
  frameCreateAccount: "node:10:20",
  frameVerifyEmail: "node:10:30",
  frameEmptyState: "node:10:40",
  framePaymentMethods: "node:20:10",
  frameConfirmPayment: "node:20:20",
  frameReceipt: "node:20:30",
  frameUsageGuide: "node:30:70",

  autoLayoutForm: "node:10:21",
  autoLayoutList: "node:20:11",
  groupLegal: "node:10:25",
  textTitle: "node:10:11",
  mediaHero: "node:10:14",

  buttonSet: "node:30:10",
  buttonPrimaryMedium: "node:30:11",
  buttonPrimaryLarge: "node:30:12",
  buttonSecondaryMedium: "node:30:13",
  buttonDanger: "node:30:14",
  inputSet: "node:30:20",
  inputDefault: "node:30:21",
  card: "node:30:30",
  avatar: "node:30:40",
  banner: "node:30:50",
  paymentRow: "node:30:60",
  remoteBrandMark: "node:RE:1001",

  instanceWelcomeButton: "node:10:12",
  instanceVerifyCard: "node:10:31",
  instanceVerifyButton: "node:10:32",
  instanceRowAvatar: "node:20:13",
  instanceBrandMark: "node:20:18",
  instanceUnresolved: "node:20:36",
  instanceCardButtonInComponent: "node:30:31",

  styleSurface: "style:S:a1b2c3d4e5f6,1",
  styleBrand: "style:S:b2c3d4e5f6a1,2",
  styleHeading: "style:S:c3d4e5f6a1b2,3",
  styleRemote: "style:S:9911aabbccdd,7",

  variableBlue: "var:VariableID:1:1",
  variableSpace4: "var:VariableID:1:2",
  variableRadius: "var:VariableID:1:3",
  variableBgSurface: "var:VariableID:2:1",
  variableTextPrimary: "var:VariableID:2:2",
  variableActionPrimary: "var:VariableID:2:3",
  collectionPrimitives: "varset:VariableCollectionId:1:0",
  collectionSemantic: "varset:VariableCollectionId:2:0",
  libraryUnknown: "lib:external-unknown",
} as const;

export function node(id: string) {
  const found = index.getNode(id);
  if (!found) throw new Error(`Fixture node missing: ${id}`);
  return found;
}

export function hasEdge(type: string, source: string, target: string): boolean {
  return graph.edges.some(
    (edge) => edge.type === type && edge.source === source && edge.target === target,
  );
}
