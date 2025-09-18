================
CODE SNIPPETS
================
TITLE: Initialize FirebaseServerApp Instance
DESCRIPTION: Example demonstrating how to initialize a `FirebaseServerApp` instance with full configuration options and an additional `authIdToken` for server-side authentication. This is crucial for server-side rendering (SSR) applications.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/app.md#_snippet_28

LANGUAGE: javascript
CODE:
```
// Initialize an instance of `FirebaseServerApp`.
// Retrieve your own options values by adding a web app on
// https://console.firebase.google.com
initializeServerApp({
    apiKey: "AIza....",                             // Auth / General Use
    authDomain: "YOUR_APP.firebaseapp.com",         // Auth with popup/redirect
    databaseURL: "https://YOUR_APP.firebaseio.com", // Realtime Database
    storageBucket: "YOUR_APP.appspot.com",          // Storage
    messagingSenderId: "123456789"                  // Cloud Messaging
  },
  {
   authIdToken: "Your Auth ID Token"
  });
```

--------------------------------

TITLE: FirebaseServerApp App Check Initialization with Token
DESCRIPTION: The `FirebaseServerApp` can now be initialized directly with an App Check token, eliminating the need to invoke the App Check `getToken` method. This change facilitates the use of App Check enforced products in Server-Side Rendering (SSR) environments where the App Check SDK might not be fully initialized.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/packages/ai/CHANGELOG.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
FirebaseServerApp:
  __init__(options: object, appCheckToken?: string)
    appCheckToken: Optional string. An App Check token to initialize the app.
    Description: Allows initialization with a pre-obtained App Check token, bypassing the need for getToken() in SSR.
```

--------------------------------

TITLE: FirebaseServerAppSettings.releaseOnDeref Property
DESCRIPTION: An optional property that uses `FinalizationRegistry` to automatically release the `FirebaseServerApp` instance when the provided object is garbage collected. This reduces memory management overhead, especially in SSR environments, by eliminating the need for explicit `deleteApp` calls. It also notes compatibility requirements for `FinalizationRegistry`.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/app.firebaseserverappsettings.md#_snippet_3

LANGUAGE: APIDOC
CODE:
```
Property: FirebaseServerAppSettings.releaseOnDeref
Type: object
Optional: true
Description: An optional object. If provided, the Firebase SDK uses a `FinalizationRegistry` object to monitor the garbage collection status of the provided object. The Firebase SDK releases its reference on the `FirebaseServerApp` instance when the provided `releaseOnDeref` object is garbage collected. You can use this field to reduce memory management overhead for your application. If provided, an app running in a SSR pass does not need to perform `FirebaseServerApp` cleanup, so long as the reference object is deleted (by falling out of SSR scope, for instance.) If an object is not provided then the application must clean up the `FirebaseServerApp` instance by invoking `deleteApp`. If the application provides an object in this parameter, but the application is executed in a JavaScript engine that predates the support of `FinalizationRegistry` (introduced in node v14.6.0, for instance), then an error is thrown at `FirebaseServerApp` initialization.
Signature: releaseOnDeref?: object;
```

--------------------------------

TITLE: Accessing the aggregated response (TypeScript)
DESCRIPTION: Provides a Promise that resolves with the complete, aggregated `EnhancedGenerateContentResponse` once the content generation stream is finished. This is useful for getting the final result without processing individual chunks.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generatecontentstreamresult.md#_snippet_1

LANGUAGE: typescript
CODE:
```
response: Promise<EnhancedGenerateContentResponse>;
```

--------------------------------

TITLE: QueryStartAtConstraint Class
DESCRIPTION: Represents a query constraint for starting a result set at or after a specific document.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/firestore.api.md#_snippet_84

LANGUAGE: APIDOC
CODE:
```
export class QueryStartAtConstraint extends QueryConstraint {
    readonly type: 'startAt' | 'startAfter';
}
```

--------------------------------

TITLE: OnResultSubscription Type
DESCRIPTION: A type definition for a callback function that is invoked when a new result is available from a query subscription.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/data-connect.api.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
type OnResultSubscription<Data, Variables> = (res: QueryResult<Data, Variables>) => void
```

--------------------------------

TITLE: Type: ConsentStatusString
DESCRIPTION: Represents the possible status values for user consent, either 'granted' or 'denied'.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/analytics.api.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
// @public
export type ConsentStatusString = 'granted' | 'denied';
```

--------------------------------

TITLE: TypeScript Type Definition for AggregateSpecData
DESCRIPTION: Represents the structure of data returned from an `AggregateSpec`, mapping keys from the spec to the result of their corresponding `AggregateField` aggregation. This generic type ensures type safety for aggregation results based on the input specification.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_204

LANGUAGE: typescript
CODE:
```
export declare type AggregateSpecData<T extends AggregateSpec> = {
    [P in keyof T]: T[P] extends AggregateField<infer U> ? U : never;
};
```

--------------------------------

TITLE: Class: TransactionResult
DESCRIPTION: A type for the resolve value of [runTransaction()](./database.md#runtransaction_a3641e5).

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/database.md#_snippet_48

LANGUAGE: APIDOC
CODE:
```
Class: TransactionResult
Description: A type for the resolve value of runTransaction().
```

--------------------------------

TITLE: startAfter
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start after the provided fields relative to the order of the query. The order of the field values must match the order of the order by clauses of the query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_38

LANGUAGE: APIDOC
CODE:
```
startAfter(fieldValues: any[])
  fieldValues: any[] - The field values to start the query after.
  Returns: QueryStartAtConstraint
```

--------------------------------

TITLE: SafetyRating Interface - TypeScript
DESCRIPTION: Defines the structure for a safety rating, indicating whether content was blocked, the harm category, probability, probability score, severity, and severity score.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/vertexai.api.md#_snippet_45

LANGUAGE: TypeScript
CODE:
```
// @public
export interface SafetyRating {
    // (undocumented)
    blocked: boolean;
    // (undocumented)
    category: HarmCategory;
    // (undocumented)
    probability: HarmProbability;
    probabilityScore: number;
    severity: HarmSeverity;
    severityScore: number;
}
```

--------------------------------

TITLE: Defining the GenerateContentStreamResult interface (TypeScript)
DESCRIPTION: Defines the structure of the result object returned by the `GenerativeModel.generateContentStream()` method. It includes properties for accessing the stream of content chunks and a promise for the final aggregated response.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generatecontentstreamresult.md#_snippet_0

LANGUAGE: typescript
CODE:
```
export interface GenerateContentStreamResult
```

--------------------------------

TITLE: Accessing the content stream (TypeScript)
DESCRIPTION: Provides an AsyncGenerator that yields `EnhancedGenerateContentResponse` objects as they become available during the content generation process. This allows for processing content chunks incrementally as they are streamed.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generatecontentstreamresult.md#_snippet_2

LANGUAGE: typescript
CODE:
```
stream: AsyncGenerator<EnhancedGenerateContentResponse>;
```

--------------------------------

TITLE: Calling generateContentStream (TypeScript)
DESCRIPTION: Makes a single streaming call to the model. Returns a Promise that resolves to a GenerateContentStreamResult, which contains an iterable stream of content chunks and a promise for the final aggregated response. Accepts a request object, string, or array of strings/Parts.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generativemodel.md#_snippet_10

LANGUAGE: TypeScript
CODE:
```
generateContentStream(request: GenerateContentRequest | string | Array<string | Part>): Promise<GenerateContentStreamResult>;
```

--------------------------------

TITLE: startAt
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start at the provided fields relative to the order of the query. The order of the field values must match the order of the order by clauses of the query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_39

LANGUAGE: APIDOC
CODE:
```
startAt(fieldValues: any[])
  fieldValues: any[] - The field values to start the query at.
  Returns: QueryStartAtConstraint
```

--------------------------------

TITLE: Firestore QueryStartAtConstraint Class Reference
DESCRIPTION: A QueryStartAtConstraint is used to exclude documents from the start of a result set returned by a Firestore query. QueryStartAtConstraints are created by invoking startAt() or startAfter() and can then be passed to query() to create a new query instance that also contains this QueryStartAtConstraint.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_86

LANGUAGE: APIDOC
CODE:
```
QueryStartAtConstraint:
  Description: Used to exclude documents from the start of a result set returned by a Firestore query.
  Creation Methods:
    - startAt()
    - startAfter()
  Usage: Passed to query() to create a new query instance.
```

--------------------------------

TITLE: GenerateContentStreamResult Interface
DESCRIPTION: Result object returned from GenerativeModel.generateContentStream() call. Iterate over stream to get chunks as they come in and/or use the response promise to get the aggregated response when the stream is done.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.md#_snippet_6

LANGUAGE: APIDOC
CODE:
```
Interface: GenerateContentStreamResult
Purpose: Result object returned from GenerativeModel.generateContentStream() call.
Notes: Iterate over stream to get chunks as they come in and/or use the response promise to get the aggregated response when the stream is done.
```

--------------------------------

TITLE: StorageObserver.complete Property Signature
DESCRIPTION: Signature for the `complete` property of `StorageObserver`, which is an optional `CompleteFn` or `null` for handling stream completion.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/storage.storageobserver.md#_snippet_2

LANGUAGE: typescript
CODE:
```
complete?: CompleteFn | null;
```

--------------------------------

TITLE: ImagenSafetyFilterLevel Enum - TypeScript
DESCRIPTION: Enumerates the possible levels for applying safety filters to image generation results. Options range from blocking only high severity content to blocking low and above.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/vertexai.api.md#_snippet_27

LANGUAGE: TypeScript
CODE:
```
// @beta
export enum ImagenSafetyFilterLevel {
    BLOCK_LOW_AND_ABOVE = "block_low_and_above",
    BLOCK_MEDIUM_AND_ABOVE = "block_medium_and_above",
    BLOCK_NONE = "block_none",
    BLOCK_ONLY_HIGH = "block_only_high"
}
```

--------------------------------

TITLE: Accessing Safety Settings in GenerativeModel (TypeScript)
DESCRIPTION: Provides access to an array of SafetySetting interfaces, allowing configuration of content moderation and safety filters for the model's responses.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generativemodel.md#_snippet_4

LANGUAGE: typescript
CODE:
```
safetySettings: SafetySetting[];
```

--------------------------------

TITLE: Defining the GenerateContentResponse Interface (TypeScript)
DESCRIPTION: Defines the structure of the response object returned by the GenerativeModel's content generation methods, used for both streaming and non-streaming responses.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generatecontentresponse.md#_snippet_0

LANGUAGE: typescript
CODE:
```
export interface GenerateContentResponse

```

--------------------------------

TITLE: Define SECOND_FACTOR_ALREADY_ENROLLED Error Code - TypeScript
DESCRIPTION: Defines the constant error code for when a second factor is already enrolled.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/auth.api.md#_snippet_68

LANGUAGE: TypeScript
CODE:
```
readonly SECOND_FACTOR_ALREADY_ENROLLED: "auth/second-factor-already-in-use";
```

--------------------------------

TITLE: ChildUpdateFields Type Alias
DESCRIPTION: Helper for calculating the nested fields for a given type T1. This is needed to distribute union types such as `undefined | {...}` (happens for optional props) or `{a: A} | {b: B}`. In this use case, `V` is used to distribute the union types of `T[K]` on `Record`, since `T[K]` is evaluated as an expression and not distributed. See https://www.typescriptlang.org/docs/handbook/advanced-types.html#distributive-conditional-types

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_98

LANGUAGE: APIDOC
CODE:
```
ChildUpdateFields:
  Description: Helper for calculating the nested fields for a given type T1. This is needed to distribute union types such as `undefined | {...}` (happens for optional props) or `{a: A} | {b: B}`. In this use case, `V` is used to distribute the union types of `T[K]` on `Record`, since `T[K]` is evaluated as an expression and not distributed. See https://www.typescriptlang.org/docs/handbook/advanced-types.html#distributive-conditional-types
```

--------------------------------

TITLE: Define HttpsCallableStreamResult Interface in TypeScript
DESCRIPTION: Defines the `HttpsCallableStreamResult` interface, which wraps a single streaming result from a Firebase Cloud Function call, including generic types for response and stream data.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/functions.httpscallablestreamresult.md#_snippet_0

LANGUAGE: typescript
CODE:
```
export interface HttpsCallableStreamResult<ResponseData = unknown, StreamData = unknown>
```

--------------------------------

TITLE: Define TaskState Enum for Upload Status
DESCRIPTION: Defines the `TaskState` type, enumerating the possible states of an upload task, including 'running', 'paused', 'success', 'canceled', and 'error'. The internal `_TaskState` and its constant are also defined.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/storage.api.md#_snippet_8

LANGUAGE: TypeScript
CODE:
```
export type TaskState = 'running' | 'paused' | 'success' | 'canceled' | 'error';

export type _TaskState = (typeof _TaskState)[keyof typeof _TaskState];

export const _TaskState: {
    readonly RUNNING: "running";
    readonly PAUSED: "paused";
    readonly SUCCESS: "success";
    readonly CANCELED: "canceled";
    readonly ERROR: "error";
};
```

--------------------------------

TITLE: Accessing SafetyRating probabilityScore Property (TypeScript)
DESCRIPTION: Signature for the 'probabilityScore' property of the SafetyRating interface, providing a numerical score for the harm category probability. This property is specific to the Vertex AI Gemini API.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.safetyrating.md#_snippet_4

LANGUAGE: typescript
CODE:
```
probabilityScore: number;
```

--------------------------------

TITLE: ImagenSafetySettings Interface - TypeScript
DESCRIPTION: Defines the safety settings that can be applied to Imagen model requests. It allows specifying filtering levels for both general safety and person-specific content.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/vertexai.api.md#_snippet_28

LANGUAGE: TypeScript
CODE:
```
// @beta
export interface ImagenSafetySettings {
    personFilterLevel?: ImagenPersonFilterLevel;
    safetyFilterLevel?: ImagenSafetyFilterLevel;
}
```

--------------------------------

TITLE: Define TotpMultiFactorGenerator Class (TypeScript)
DESCRIPTION: Provides static methods for generating TOTP multi-factor assertions for enrollment and sign-in processes. It includes a constant for the TOTP factor ID.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/auth.api.md#_snippet_164

LANGUAGE: TypeScript
CODE:
```
// @public
export class TotpMultiFactorGenerator {
    static assertionForEnrollment(secret: TotpSecret, oneTimePassword: string): TotpMultiFactorAssertion;
    static assertionForSignIn(enrollmentId: string, oneTimePassword: string): TotpMultiFactorAssertion;
    static FACTOR_ID: 'totp';
}
```

--------------------------------

TITLE: Define Query Start Boundary (Inclusive)
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start at the provided fields relative to the order of the query. The order of the field values must match the order of the order by clauses of the query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_lite.md#_snippet_117

LANGUAGE: APIDOC
CODE:
```
startAt(...fieldValues: unknown[]): QueryStartAtConstraint
  fieldValues: unknown[] - The field values to start this query at, in order of the query's order by.
Returns: QueryStartAtConstraint - A QueryStartAtConstraint to pass to `query()`.
```

LANGUAGE: TypeScript
CODE:
```
export declare function startAt(...fieldValues: unknown[]): QueryStartAtConstraint;
```

--------------------------------

TITLE: Defining the candidates Property (TypeScript)
DESCRIPTION: Specifies the optional 'candidates' property within the GenerateContentResponse, which is an array of GenerateContentCandidate objects containing the generated content alternatives.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generatecontentresponse.md#_snippet_1

LANGUAGE: typescript
CODE:
```
candidates?: GenerateContentCandidate[];

```

--------------------------------

TITLE: TotpMultiFactorAssertion Class
DESCRIPTION: This class is used to assert ownership of a Time-based One-Time Password (TOTP) second factor during multi-factor authentication flows. Instances of this class are typically generated by TotpMultiFactorGenerator methods for enrollment or sign-in.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/auth.md#_snippet_41

LANGUAGE: APIDOC
CODE:
```
TotpMultiFactorAssertion:
  Description: The class for asserting ownership of a TOTP second factor.
  Provided by: TotpMultiFactorGenerator.assertionForEnrollment() and TotpMultiFactorGenerator.assertionForSignIn().
```

--------------------------------

TITLE: Define RecaptchaVerifier Class (TypeScript)
DESCRIPTION: Represents a reCAPTCHA verifier instance used for verifying user interactions, typically before phone number sign-in. It extends ApplicationVerifierInternal and provides methods to render, verify, clear, and reset the reCAPTCHA widget.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/auth.api.md#_snippet_145

LANGUAGE: TypeScript
CODE:
```
// Warning: (ae-forgotten-export) The symbol "ApplicationVerifierInternal" needs to be exported by the entry point index.d.ts
//
// @public
export class RecaptchaVerifier implements ApplicationVerifierInternal {
    constructor(authExtern: Auth, containerOrId: HTMLElement | string, parameters?: RecaptchaParameters);
    clear(): void;
    // Warning: (ae-forgotten-export) The symbol "ReCaptchaLoader" needs to be exported by the entry point index.d.ts
    //
    // @internal (undocumented)
    readonly _recaptchaLoader: ReCaptchaLoader;
    render(): Promise<number>;
    // @internal (undocumented)
    _reset(): void;
    readonly type = "recaptcha";
    verify(): Promise<string>;
    }
```

--------------------------------

TITLE: Define PartialObserver Type Alias (TypeScript)
DESCRIPTION: Defines a public type alias for a partial version of the Observer interface, allowing observers to implement only a subset of the Observer methods.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/util.api.md#_snippet_50

LANGUAGE: TypeScript
CODE:
```
export type PartialObserver<T> = Partial<Observer<T>>;
```

--------------------------------

TITLE: API Reference: startAt (Firestore JS SDK Query Constraint)
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start at the provided document (inclusive). The starting position is relative to the order of the query. The document must contain all of the fields provided in the orderBy of this query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_76

LANGUAGE: APIDOC
CODE:
```
startAt(snapshot: DocumentSnapshot | any[]): QueryStartAtConstraint
  snapshot: The document or array of field values to start at (inclusive).
  Constraint: Document must contain all fields from the query's orderBy.
```

--------------------------------

TITLE: Get Multi-Factor Resolver
DESCRIPTION: Retrieves a MultiFactorResolver instance from a MultiFactorError, which is used to resolve a multi-factor sign-in challenge.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/auth.api.md#_snippet_84

LANGUAGE: TypeScript
CODE:
```
export function getMultiFactorResolver(auth: Auth, error: MultiFactorError): MultiFactorResolver;
```

--------------------------------

TITLE: Define AggregateQuerySnapshot Class in TypeScript
DESCRIPTION: Defines the `AggregateQuerySnapshot` class, which represents the results of an aggregation query in Firebase Firestore. It is a generic class that extends `DocumentData`.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_lite.aggregatequerysnapshot.md#_snippet_0

LANGUAGE: typescript
CODE:
```
export declare class AggregateQuerySnapshot<AggregateSpecType extends AggregateSpec, AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>
```

--------------------------------

TITLE: TransactionResult Class
DESCRIPTION: Represents the result of a Firebase Realtime Database transaction, indicating whether the transaction was committed and providing the resulting DataSnapshot.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/database.api.md#_snippet_25

LANGUAGE: APIDOC
CODE:
```
export class TransactionResult {
    readonly committed: boolean;
    readonly snapshot: DataSnapshot;
    toJSON(): object;
}
```

--------------------------------

TITLE: SafetySetting Interface - TypeScript
DESCRIPTION: Defines a specific safety setting for a harm category, including the category itself, the blocking method, and the threshold at which content should be blocked.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/vertexai.api.md#_snippet_46

LANGUAGE: TypeScript
CODE:
```
// @public
export interface SafetySetting {
    // (undocumented)
    category: HarmCategory;
    method?: HarmBlockMethod;
    // (undocumented)
    threshold: HarmBlockThreshold;
}
```

--------------------------------

TITLE: API Reference: startAfter (Firestore JS SDK Query Constraint)
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start after the provided document (exclusive). The starting position is relative to the order of the query. The document must contain all of the fields provided in the orderBy of the query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_75

LANGUAGE: APIDOC
CODE:
```
startAfter(snapshot: DocumentSnapshot | any[]): QueryStartAtConstraint
  snapshot: The document or array of field values to start after (exclusive).
  Constraint: Document must contain all fields from the query's orderBy.
```

--------------------------------

TITLE: API: startAt Function for Firestore Query Constraints
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start at the provided fields relative to the order of the query. The order of the field values must match the order of the order by clauses of the query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_151

LANGUAGE: APIDOC
CODE:
```
startAt(...fieldValues: unknown[]): QueryStartAtConstraint
  fieldValues: unknown[] - The field values to start this query at, in order of the query's order by.
Returns: QueryStartAtConstraint - A QueryStartAtConstraint to pass to `query()`.
```

--------------------------------

TITLE: GenerateContentResult Interface
DESCRIPTION: Result object returned from GenerativeModel.generateContent() call.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.md#_snippet_5

LANGUAGE: APIDOC
CODE:
```
Interface: GenerateContentResult
Purpose: Result object returned from GenerativeModel.generateContent() call.
```

--------------------------------

TITLE: Declare HarmSeverity Enum in TypeScript
DESCRIPTION: Declares the `HarmSeverity` enumeration, which defines the harm severity levels for content. This enum provides a measure of the intensity of harm associated with content.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.md#_snippet_65

LANGUAGE: TypeScript
CODE:
```
export declare enum HarmSeverity
```

--------------------------------

TITLE: Defining GenerateContentResult Interface (TypeScript)
DESCRIPTION: Defines the GenerateContentResult interface, which serves as the result object returned by the GenerativeModel.generateContent() method.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generatecontentresult.md#_snippet_0

LANGUAGE: typescript
CODE:
```
export interface GenerateContentResult
```

--------------------------------

TITLE: ImagenAspectRatio Enum (Beta)
DESCRIPTION: Defines standard aspect ratios for Imagen image generation, such as landscape, portrait, and square. This is a beta API.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/ai.api.md#_snippet_57

LANGUAGE: APIDOC
CODE:
```
export enum ImagenAspectRatio {
  LANDSCAPE_16x9 = "16:9",
  LANDSCAPE_3x4 = "3:4",
  PORTRAIT_4x3 = "4:3",
  PORTRAIT_9x16 = "9:16",
  SQUARE = "1:1"
}
```

--------------------------------

TITLE: API: startAfter Function for Firestore Query Constraints
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start after the provided fields relative to the order of the query. The order of the field values must match the order of the order by clauses of the query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_150

LANGUAGE: APIDOC
CODE:
```
startAfter(...fieldValues: unknown[]): QueryStartAtConstraint
  fieldValues: unknown[] - The field values to start this query after, in order of the query's order by.
Returns: QueryStartAtConstraint - A QueryStartAtConstraint to pass to `query()`.
```

--------------------------------

TITLE: API Reference: GenerateContentResult Interface
DESCRIPTION: Represents the result of a single content generation operation, providing the enhanced response from the model.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/ai.api.md#_snippet_36

LANGUAGE: APIDOC
CODE:
```
export interface GenerateContentResult {
  response: EnhancedGenerateContentResponse;
}
```

--------------------------------

TITLE: QueryStartAtConstraint Class
DESCRIPTION: A QueryStartAtConstraint is used to exclude documents from the start of a result set returned by a Firestore query. QueryStartAtConstraint's are created by invoking startAt() or startAfter() and can then be passed to query() to create a new query instance that also contains this QueryStartAtConstraint.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_lite.md#_snippet_63

LANGUAGE: APIDOC
CODE:
```
QueryStartAtConstraint:
  description: Excludes documents from the start of a query result set.
  creation_methods:
    - startAt()
    - startAfter()
  usage: Passed to query() to build a new query.
```

--------------------------------

TITLE: Firestore Query: startAt
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start at the provided fields relative to the order of the query. The order of the field values must match the order of the order by clauses of the query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_lite.md#_snippet_24

LANGUAGE: APIDOC
CODE:
```
startAt(fieldValues: any[] | DocumentSnapshot)
  fieldValues: The field values or a DocumentSnapshot to start the query at. The order must match the query's order by clauses.
  Returns: QueryStartAtConstraint
```

--------------------------------

TITLE: Define RANDOM_FACTOR Constant (TypeScript)
DESCRIPTION: Defines a public constant used as a random factor, initialized to 0.5.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/util.api.md#_snippet_55

LANGUAGE: TypeScript
CODE:
```
export const RANDOM_FACTOR = 0.5;
```

--------------------------------

TITLE: API Reference: GenerateContentStreamResult Interface
DESCRIPTION: Represents the result of a streaming content generation operation, providing both a promise for the final response and an asynchronous generator for the stream.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/ai.api.md#_snippet_37

LANGUAGE: APIDOC
CODE:
```
export interface GenerateContentStreamResult {
  response: Promise<EnhancedGenerateContentResponse>;
  stream: AsyncGenerator<EnhancedGenerateContentResponse>;
}
```

--------------------------------

TITLE: MultiFactorResolver Interface
DESCRIPTION: Defines the interface for resolving a multi-factor sign-in challenge, including available hints and a method to resolve the sign-in.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/auth.api.md#_snippet_112

LANGUAGE: TypeScript
CODE:
```
export interface MultiFactorResolver {
    readonly hints: MultiFactorInfo[];
    resolveSignIn(assertion: MultiFactorAssertion): Promise<UserCredential>;
    readonly session: MultiFactorSession;
}
```

--------------------------------

TITLE: TaskState Type Definition
DESCRIPTION: Represents the state of bundle loading tasks.

Both 'Error' and 'Success' are sinking state: task will abort or complete and there will be no more updates after they are reported.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_221

LANGUAGE: typescript
CODE:
```
export declare type TaskState = 'Error' | 'Running' | 'Success';
```

--------------------------------

TITLE: TotpMultiFactorGenerator.assertionForEnrollment Method
DESCRIPTION: Generates a `TotpMultiFactorAssertion` to confirm ownership of a TOTP second factor, specifically used for completing the enrollment process. Requires a `TotpSecret` and a one-time password.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/auth.totpmultifactorgenerator.md#_snippet_2

LANGUAGE: TypeScript
CODE:
```
static assertionForEnrollment(secret: TotpSecret, oneTimePassword: string): TotpMultiFactorAssertion;

Parameters:
  secret: TotpSecret - A TotpSecret containing the shared secret key and other TOTP parameters.
  oneTimePassword: string - One-time password from TOTP App.

Returns:
  TotpMultiFactorAssertion - A TotpMultiFactorAssertion which can be used with MultiFactorUser.enroll().
```

--------------------------------

TITLE: Define Observable Interface (TypeScript)
DESCRIPTION: Defines a public interface for an Observable, which represents a source of values. It includes a 'subscribe' method to register observers.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/util.api.md#_snippet_47

LANGUAGE: TypeScript
CODE:
```
export interface Observable<T> {
    subscribe: Subscribe<T>;
}
```

--------------------------------

TITLE: Declare ImagenAspectRatio Enum in TypeScript
DESCRIPTION: Declares the `ImagenAspectRatio` enumeration, which defines aspect ratios for Imagen images. This API is a preview and should not be used in production. It can be set via the `aspectRatio` property in `ImagenGenerationConfig`.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.md#_snippet_67

LANGUAGE: TypeScript
CODE:
```
export declare enum ImagenAspectRatio
```

--------------------------------

TITLE: Accessing SafetyRating severityScore Property (TypeScript)
DESCRIPTION: Signature for the 'severityScore' property of the SafetyRating interface, providing a numerical score for the harm severity. This property is specific to the Vertex AI Gemini API.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.safetyrating.md#_snippet_6

LANGUAGE: typescript
CODE:
```
severityScore: number;
```

--------------------------------

TITLE: Firestore QueryStartAtConstraint Class API Definition
DESCRIPTION: Documents the `QueryStartAtConstraint` class, which extends `QueryConstraint` and is used in Firestore to define the starting point of a query result set. It includes the class signature and its properties.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.querystartatconstraint.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Class: QueryStartAtConstraint
  Description: A QueryStartAtConstraint is used to exclude documents from the start of a result set returned by a Firestore query. QueryStartAtConstraints are created by invoking startAt() or startAfter() and can then be passed to query() to create a new query instance that also contains this QueryStartAtConstraint.
  Signature: export declare class QueryStartAtConstraint extends QueryConstraint
  Extends: QueryConstraint
  Properties:
    type:
      Description: The type of this query constraint
      Modifiers:
      Type: 'startAt' | 'startAfter'
      Signature: readonly type: 'startAt' | 'startAfter';
```

--------------------------------

TITLE: Firestore: startAfter Query Constraint
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start after the provided document (exclusive). The starting position is relative to the order of the query. The document must contain all of the fields provided in the orderBy of the query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_198

LANGUAGE: TypeScript
CODE:
```
export declare function startAfter<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryStartAtConstraint;
```

LANGUAGE: APIDOC
CODE:
```
Parameters:
  snapshot: DocumentSnapshot<AppModelType, DbModelType> - The snapshot of the document to start after.
Returns:
  QueryStartAtConstraint - A QueryStartAtConstraint to pass to `query()`
```

--------------------------------

TITLE: QUERY_STR Constant
DESCRIPTION: A constant string representing the 'query' operation type.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/data-connect.api.md#_snippet_7

LANGUAGE: APIDOC
CODE:
```
const QUERY_STR = "query"
```

--------------------------------

TITLE: Define Query Start Boundary (Exclusive)
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start after the provided fields relative to the order of the query. The order of the field values must match the order of the order by clauses of the query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_lite.md#_snippet_116

LANGUAGE: APIDOC
CODE:
```
startAfter(...fieldValues: unknown[]): QueryStartAtConstraint
  fieldValues: unknown[] - The field values to start this query after, in order of the query's order by.
Returns: QueryStartAtConstraint - A QueryStartAtConstraint to pass to `query()`
```

LANGUAGE: TypeScript
CODE:
```
export declare function startAfter(...fieldValues: unknown[]): QueryStartAtConstraint;
```

--------------------------------

TITLE: Define StorageObserver Interface
DESCRIPTION: Defines the `StorageObserver` interface, a generic stream observer for Firebase Storage operations, specifying methods for handling completion, errors, and next values.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/storage.storageobserver.md#_snippet_0

LANGUAGE: typescript
CODE:
```
export interface StorageObserver<T>
```

--------------------------------

TITLE: QueryStartAtConstraint.type Property Details
DESCRIPTION: Describes the `type` property of the `QueryStartAtConstraint` class. This property indicates whether the constraint is `startAt` or `startAfter`, defining how documents are excluded from the start of a query result set.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_lite.querystartatconstraint.md#_snippet_1

LANGUAGE: typescript
CODE:
```
readonly type: 'startAt' | 'startAfter';
```

LANGUAGE: APIDOC
CODE:
```
QueryStartAtConstraint.type:
  Description: The type of this query constraint
  Type: 'startAt' | 'startAfter'
  Modifiers: readonly
```

--------------------------------

TITLE: GenerateContentResponse Interface
DESCRIPTION: Individual response from GenerativeModel.generateContent() and GenerativeModel.generateContentStream(). generateContentStream() will return one in each chunk until the stream is done.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
Interface: GenerateContentResponse
Purpose: Individual response from GenerativeModel.generateContent() and GenerativeModel.generateContentStream().
Notes: generateContentStream() will return one in each chunk until the stream is done.
```

--------------------------------

TITLE: Define TotpMultiFactorAssertion Interface (TypeScript)
DESCRIPTION: Defines the interface for a TOTP (Time-based One-Time Password) multi-factor assertion. It extends the base MultiFactorAssertion interface.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/auth.api.md#_snippet_163

LANGUAGE: TypeScript
CODE:
```
// @public
export interface TotpMultiFactorAssertion extends MultiFactorAssertion {
}
```

--------------------------------

TITLE: Firestore: startAt Query Constraint
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start at the provided document (inclusive). The starting position is relative to the order of the query. The document must contain all of the fields provided in the `orderBy` of this query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_199

LANGUAGE: TypeScript
CODE:
```
export declare function startAt<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryStartAtConstraint;
```

LANGUAGE: APIDOC
CODE:
```
Parameters:
  snapshot: DocumentSnapshot<AppModelType, DbModelType> - The snapshot of the document to start at.
Returns:
  QueryStartAtConstraint - A QueryStartAtConstraint to pass to `query()`.
```

--------------------------------

TITLE: Firestore Query: startAt
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start at the provided document (inclusive). The starting position is relative to the order of the query. The document must contain all of the fields provided in the `orderBy` of this query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_lite.md#_snippet_153

LANGUAGE: APIDOC
CODE:
```
startAt(snapshot)
  Signature: export declare function startAt<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryStartAtConstraint;
  snapshot: DocumentSnapshot<AppModelType, DbModelType>
    Description: The snapshot of the document to start at.
  Returns: QueryStartAtConstraint
    Description: A QueryStartAtConstraint to pass to `query()`.
```

--------------------------------

TITLE: Updating Emulator Banner in Firebase JS SDK (TypeScript)
DESCRIPTION: Defines a function to update the display of an emulator banner based on the emulator's name and whether it is currently running.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/util.api.md#_snippet_64

LANGUAGE: TypeScript
CODE:
```
export function updateEmulatorBanner(name: string, isRunningEmulator: boolean): void;
```

--------------------------------

TITLE: ResponseModality Constant - TypeScript
DESCRIPTION: A constant object defining the possible modalities for a response, specifically 'TEXT' and 'IMAGE'.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/vertexai.api.md#_snippet_41

LANGUAGE: TypeScript
CODE:
```
// @beta
export const ResponseModality: {
    readonly TEXT: "TEXT";
    readonly IMAGE: "IMAGE";
};
```

--------------------------------

TITLE: ImagenGCSImage gcsURI Example (Text)
DESCRIPTION: An example value for the `gcsURI` property, showing the format of a Cloud Storage URI.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.imagengcsimage.md#_snippet_2

LANGUAGE: text
CODE:
```
"gs://bucket-name/path/sample_0.jpg"
```

--------------------------------

TITLE: StorageObserver.next Property Signature
DESCRIPTION: Signature for the `next` property of `StorageObserver`, an optional `NextFn<T>` or `null` for processing the next value in the stream.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/storage.storageobserver.md#_snippet_4

LANGUAGE: typescript
CODE:
```
next?: NextFn<T> | null;
```

--------------------------------

TITLE: ChildUpdateFields Type Alias
DESCRIPTION: Helper for calculating the nested fields for a given type T1. This is needed to distribute union types such as `undefined | {...}` (happens for optional props) or `{a: A} | {b: B}`. In this use case, `V` is used to distribute the union types of `T[K]` on `Record`, since `T[K]` is evaluated as an expression and not distributed. See https://www.typescriptlang.org/docs/handbook/advanced-types.html#distributive-conditional-types

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_lite.md#_snippet_77

LANGUAGE: APIDOC
CODE:
```
Type Alias: ChildUpdateFields
Description: Helper for calculating the nested fields for a given type T1. This is needed to distribute union types such as `undefined | {...}` (happens for optional props) or `{a: A} | {b: B}`. In this use case, `V` is used to distribute the union types of `T[K]` on `Record`, since `T[K]` is evaluated as an expression and not distributed. See https://www.typescriptlang.org/docs/handbook/advanced-types.html#distributive-conditional-types
```

--------------------------------

TITLE: Defining ImagenGenerationResponse Interface (TypeScript)
DESCRIPTION: Defines the `ImagenGenerationResponse` interface, which represents the structure of the response received after requesting image generation with Imagen. It includes a generic type parameter `T` to specify the type of images returned (inline or GCS). This API is currently in public preview.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.imagengenerationresponse.md#_snippet_0

LANGUAGE: typescript
CODE:
```
export interface ImagenGenerationResponse<T extends ImagenInlineImage | ImagenGCSImage>
```

--------------------------------

TITLE: ImagenPersonFilterLevel Enum - TypeScript
DESCRIPTION: Enumerates the possible levels for filtering content based on the presence of people in images. Options include allowing adult content, allowing all content, or blocking all content.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/vertexai.api.md#_snippet_26

LANGUAGE: TypeScript
CODE:
```
// @beta
export enum ImagenPersonFilterLevel {
    ALLOW_ADULT = "allow_adult",
    ALLOW_ALL = "allow_all",
    BLOCK_ALL = "dont_allow"
}
```

--------------------------------

TITLE: Define Sha1 Class (TypeScript)
DESCRIPTION: Defines a public class for performing SHA-1 hashing. It includes methods for updating the hash with data, resetting, and getting the digest.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/util.api.md#_snippet_57

LANGUAGE: TypeScript
CODE:
```
export class Sha1 {
    constructor();
    blockSize: number;
    compress_(buf: number[] | Uint8Array | string, offset?: number): void;
    digest(): number[];
    reset(): void;
    update(bytes?: number[] | Uint8Array | string, length?: number): void;
}
```

--------------------------------

TITLE: Defining SafetyRating Interface (TypeScript)
DESCRIPTION: Defines the structure of the SafetyRating interface, which represents a safety rating associated with a generated content candidate.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.safetyrating.md#_snippet_0

LANGUAGE: typescript
CODE:
```
export interface SafetyRating
```

--------------------------------

TITLE: ImagenSafetyFilterLevel Enum
DESCRIPTION: Specifies levels for general safety filtering in Imagen image generation, allowing granular control over blocking content based on severity.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/ai.api.md#_snippet_67

LANGUAGE: APIDOC
CODE:
```
export enum ImagenSafetyFilterLevel {
    BLOCK_LOW_AND_ABOVE = "block_low_and_above",
    BLOCK_MEDIUM_AND_ABOVE = "block_medium_and_above",
    BLOCK_NONE = "block_none",
    BLOCK_ONLY_HIGH = "block_only_high"
}
```

--------------------------------

TITLE: HarmSeverity Enum
DESCRIPTION: Specifies the severity levels of harmful content, from negligible to high, including an unsupported state.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/ai.api.md#_snippet_56

LANGUAGE: APIDOC
CODE:
```
export enum HarmSeverity {
  HARM_SEVERITY_HIGH = "HARM_SEVERITY_HIGH",
  HARM_SEVERITY_LOW = "HARM_SEVERITY_LOW",
  HARM_SEVERITY_MEDIUM = "HARM_SEVERITY_MEDIUM",
  HARM_SEVERITY_NEGLIGIBLE = "HARM_SEVERITY_NEGLIGIBLE",
  HARM_SEVERITY_UNSUPPORTED = "HARM_SEVERITY_UNSUPPORTED"
}
```

--------------------------------

TITLE: QueryStartAtConstraint Class Definition
DESCRIPTION: Defines the `QueryStartAtConstraint` class, a specialized `QueryConstraint` used in Firestore to specify the starting point for query results. It extends the base `QueryConstraint` class.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_lite.querystartatconstraint.md#_snippet_0

LANGUAGE: typescript
CODE:
```
export declare class QueryStartAtConstraint extends QueryConstraint
```

LANGUAGE: APIDOC
CODE:
```
QueryStartAtConstraint class:
  Extends: QueryConstraint
```

--------------------------------

TITLE: ImagenSafetySettings Interface
DESCRIPTION: Configuration for safety settings in Imagen, combining person-specific and general safety filter levels.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/ai.api.md#_snippet_68

LANGUAGE: APIDOC
CODE:
```
export interface ImagenSafetySettings {
    personFilterLevel?: ImagenPersonFilterLevel;
    safetyFilterLevel?: ImagenSafetyFilterLevel;
}
```

--------------------------------

TITLE: POSSIBLE_ROLES Constant - TypeScript
DESCRIPTION: A readonly array listing the possible roles that can be assigned to content parts in a conversation, such as 'user', 'model', 'function', or 'system'.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/vertexai.api.md#_snippet_38

LANGUAGE: TypeScript
CODE:
```
// @public
export const POSSIBLE_ROLES: readonly ["user", "model", "function", "system"];
```

--------------------------------

TITLE: Registering FCM Service Worker with VAPID Key
DESCRIPTION: This JavaScript snippet registers a service worker (`sw.js`) for Firebase Cloud Messaging (FCM). It initializes a `DemoApp` instance, passing Firebase configuration and a VAPID key for secure push notifications. Errors during registration are logged to the console.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/integration/messaging/test/static/valid-vapid-key/index.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
navigator.serviceWorker .register('./sw.js') .then(reg => { window.__test = new window.DemoApp(FIREBASE_CONFIG, { swReg: reg, vapidKey: PUBLIC_VAPID_KEY }); }) .catch(error => { console.log('Error registering FCM SW: ' + error); });
```

--------------------------------

TITLE: TotpMultiFactorGenerator.assertionForSignIn Method
DESCRIPTION: Generates a `TotpMultiFactorAssertion` to confirm ownership of a TOTP second factor, specifically used for completing the sign-in process. Requires the enrollment ID and a one-time password.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/auth.totpmultifactorgenerator.md#_snippet_3

LANGUAGE: TypeScript
CODE:
```
static assertionForSignIn(enrollmentId: string, oneTimePassword: string): TotpMultiFactorAssertion;

Parameters:
  enrollmentId: string - identifies the enrolled TOTP second factor.
  oneTimePassword: string - One-time password from TOTP App.

Returns:
  TotpMultiFactorAssertion - A TotpMultiFactorAssertion which can be used with MultiFactorResolver.resolveSignIn().
```

--------------------------------

TITLE: Generating Content with GenerativeModel (Non-Streaming) in TypeScript
DESCRIPTION: Sends a single request to the generative model and returns a promise that resolves with the complete, non-streaming response.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generativemodel.md#_snippet_9

LANGUAGE: typescript
CODE:
```
generateContent(request: GenerateContentRequest | string | Array<string | Part>): Promise<GenerateContentResult>;
```

--------------------------------

TITLE: Define MAX_VALUE_MILLIS Constant (TypeScript)
DESCRIPTION: Defines a public constant representing a maximum value in milliseconds. This constant is exported for external use.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/util.api.md#_snippet_45

LANGUAGE: TypeScript
CODE:
```
export const MAX_VALUE_MILLIS: number;
```

--------------------------------

TITLE: Exporting Constant getExperimentalSetting - Firebase Config - TypeScript
DESCRIPTION: Provides a function type for retrieving a specific experimental setting from the Firebase defaults based on its key.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/util.api.md#_snippet_19

LANGUAGE: typescript
CODE:
```
export const getExperimentalSetting: <T extends ExperimentalKey>(name: T) => FirebaseDefaults[`_${T}`];
```

--------------------------------

TITLE: Get Server Timestamp FieldValue
DESCRIPTION: Returns a sentinel value used with `setDoc()` or `updateDoc()` to include a server-generated timestamp in the written data.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_.md#_snippet_140

LANGUAGE: TypeScript
CODE:
```
export declare function serverTimestamp(): FieldValue;
```

--------------------------------

TITLE: SerializedRef Interface
DESCRIPTION: Represents a serialized reference to an operation result, extending OpResult and including reference information.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/data-connect.api.md#_snippet_15

LANGUAGE: APIDOC
CODE:
```
interface SerializedRef<Data, Variables> extends OpResult<Data>
  refInfo: RefInfo<Variables>
```

--------------------------------

TITLE: Registering FCM Service Worker with VAPID Key in JavaScript
DESCRIPTION: This snippet registers a Service Worker (`sw.js`) for Firebase Cloud Messaging. It initializes a `DemoApp` instance, passing the Firebase configuration, the registered Service Worker, and a public VAPID key. Errors encountered during registration are logged to the console.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/integration/messaging/test/static/valid-vapid-key-modern-sw/index.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
navigator.serviceWorker .register('./sw.js') .then(reg => { window.__test = new window.DemoApp(FIREBASE_CONFIG, { swReg: reg, vapidKey: PUBLIC_VAPID_KEY }); }) .catch(error => { console.log('Error registering FCM SW: ' + error); });
```

--------------------------------

TITLE: MultiFactorAssertion Interface
DESCRIPTION: Defines the structure for an assertion used to complete a multi-factor sign-in challenge.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/auth.api.md#_snippet_109

LANGUAGE: TypeScript
CODE:
```
export interface MultiFactorAssertion {
    readonly factorId: (typeof FactorId)[keyof typeof FactorId];
}
```

--------------------------------

TITLE: Firestore Query: startAfter
DESCRIPTION: Creates a QueryStartAtConstraint that modifies the result set to start after the provided document (exclusive). The starting position is relative to the order of the query. The document must contain all of the fields provided in the orderBy of the query.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/firestore_lite.md#_snippet_152

LANGUAGE: APIDOC
CODE:
```
startAfter(snapshot)
  Signature: export declare function startAfter<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryStartAtConstraint;
  snapshot: DocumentSnapshot<AppModelType, DbModelType>
    Description: The snapshot of the document to start after.
  Returns: QueryStartAtConstraint
    Description: A QueryStartAtConstraint to pass to `query()`
```

--------------------------------

TITLE: Declare HarmCategory Enum in TypeScript
DESCRIPTION: Declares the `HarmCategory` enumeration, which defines the types of harm categories that would cause prompts or candidates to be blocked. This enum helps categorize content for safety filtering.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.md#_snippet_61

LANGUAGE: TypeScript
CODE:
```
export declare enum HarmCategory
```

--------------------------------

TITLE: Defining response Property in GenerateContentResult (TypeScript)
DESCRIPTION: Defines the 'response' property within the GenerateContentResult interface. This property holds the EnhancedGenerateContentResponse object.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generatecontentresult.md#_snippet_1

LANGUAGE: typescript
CODE:
```
response: EnhancedGenerateContentResponse;
```

--------------------------------

TITLE: PromptFeedback Interface - TypeScript
DESCRIPTION: Defines the structure for feedback on a prompt, indicating if it was blocked and why, and providing safety ratings for different categories.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/vertexai.api.md#_snippet_39

LANGUAGE: TypeScript
CODE:
```
// @public
export interface PromptFeedback {
    // (undocumented)
    blockReason?: BlockReason;
    blockReasonMessage?: string;
    // (undocumented)
    safetyRatings: SafetyRating[];
}
```

--------------------------------

TITLE: indexedDBLocalPersistence Constant
DESCRIPTION: A constant representing the persistence mechanism that stores authentication state in IndexedDB.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/auth.api.md#_snippet_99

LANGUAGE: TypeScript
CODE:
```
export const indexedDBLocalPersistence: Persistence;
```

--------------------------------

TITLE: ModalityTokenCount Interface - TypeScript
DESCRIPTION: Defines a structure to report the token count for a specific content modality. It includes the modality type and the corresponding token count.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/vertexai.api.md#_snippet_32

LANGUAGE: TypeScript
CODE:
```
// @public
export interface ModalityTokenCount {
    modality: Modality;
    tokenCount: number;
}
```

--------------------------------

TITLE: QueryStartAtConstraint Class
DESCRIPTION: Represents a query constraint that specifies the starting point for a query's results, exclusive or inclusive.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/firestore-lite.api.md#_snippet_45

LANGUAGE: APIDOC
CODE:
```
class QueryStartAtConstraint extends QueryConstraint {
    readonly type: 'startAt' | 'startAfter';
}
```

--------------------------------

TITLE: Define ValueSource Type in TypeScript
DESCRIPTION: Defines a TypeScript union type `ValueSource` to represent the origin of a configuration value. Possible values include 'static' for constant values, 'default' for default configurations, and 'remote' for fetched configurations.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/remote-config.md#_snippet_20

LANGUAGE: typescript
CODE:
```
export type ValueSource = 'static' | 'default' | 'remote';
```

--------------------------------

TITLE: StorageObserver.error Property Signature
DESCRIPTION: Signature for the `error` property of `StorageObserver`, an optional function that handles `StorageError` instances or `null` when a stream error occurs.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/storage.storageobserver.md#_snippet_3

LANGUAGE: typescript
CODE:
```
error?: (error: StorageError) => void | null;
```

--------------------------------

TITLE: QueryResult Interface
DESCRIPTION: Represents the result of a query operation, extending DataConnectResult and including a reference to the query and a method to serialize it.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/data-connect.api.md#_snippet_11

LANGUAGE: APIDOC
CODE:
```
interface QueryResult<Data, Variables> extends DataConnectResult<Data, Variables>
  ref: QueryRef<Data, Variables>
  toJSON: () => SerializedRef<Data, Variables>
```

--------------------------------

TITLE: MultiFactorInfo Interface
DESCRIPTION: Defines the structure for information about an enrolled multi-factor second factor.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/auth.api.md#_snippet_111

LANGUAGE: TypeScript
CODE:
```
export interface MultiFactorInfo {
    readonly displayName?: string | null;
    readonly enrollmentTime: string;
    readonly factorId: (typeof FactorId)[keyof typeof FactorId];
    readonly uid: string;
}
```

--------------------------------

TITLE: Defining EnhancedGenerateContentResponse Interface (TypeScript)
DESCRIPTION: Defines the structure of the EnhancedGenerateContentResponse interface in TypeScript, indicating that it extends the base GenerateContentResponse interface to add further capabilities.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.enhancedgeneratecontentresponse.md#_snippet_0

LANGUAGE: typescript
CODE:
```
export interface EnhancedGenerateContentResponse extends GenerateContentResponse
```

--------------------------------

TITLE: API Reference: FinishReason Enum
DESCRIPTION: Enumerates the possible reasons why a generative model's content generation might have finished. This includes reasons like reaching token limits, safety blocks, or explicit stop sequences.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/ai.api.md#_snippet_24

LANGUAGE: APIDOC
CODE:
```
export enum FinishReason {
  BLOCKLIST = "BLOCKLIST",
  MALFORMED_FUNCTION_CALL = "MALFORMED_FUNCTION_CALL",
  MAX_TOKENS = "MAX_TOKENS",
  OTHER = "OTHER",
  PROHIBITED_CONTENT = "PROHIBITED_CONTENT",
  RECITATION = "RECITATION",
  SAFETY = "SAFETY",
  SPII = "SPII",
  STOP = "STOP"
}
```

--------------------------------

TITLE: subscribe Function
DESCRIPTION: Subscribes to a query, providing real-time updates. It can take either a QueryRef/SerializedRef and an observer object, or individual callback functions for next, error, and complete events.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/data-connect.api.md#_snippet_19

LANGUAGE: APIDOC
CODE:
```
function subscribe<Data, Variables>(queryRefOrSerializedResult: QueryRef<Data, Variables> | SerializedRef<Data, Variables>, observer: SubscriptionOptions<Data, Variables>): QueryUnsubscribe
  Parameters:
    queryRefOrSerializedResult: QueryRef<Data, Variables> | SerializedRef<Data, Variables> - The query reference or a serialized result to subscribe to.
    observer: SubscriptionOptions<Data, Variables> - An object containing onNext, onError, and onComplete callbacks.
  Returns: QueryUnsubscribe - A function to unsubscribe from the query.
```

LANGUAGE: APIDOC
CODE:
```
function subscribe<Data, Variables>(queryRefOrSerializedResult: QueryRef<Data, Variables> | SerializedRef<Data, Variables>, onNext: OnResultSubscription<Data, Variables>, onError?: OnErrorSubscription, onComplete?: OnCompleteSubscription): QueryUnsubscribe
  Parameters:
    queryRefOrSerializedResult: QueryRef<Data, Variables> | SerializedRef<Data, Variables> - The query reference or a serialized result to subscribe to.
    onNext: OnResultSubscription<Data, Variables> - Callback for new results.
    onError?: OnErrorSubscription - Optional callback for errors.
    onComplete?: OnCompleteSubscription - Optional callback for completion.
  Returns: QueryUnsubscribe - A function to unsubscribe from the query.
```

--------------------------------

TITLE: Define Observer Interface (TypeScript)
DESCRIPTION: Defines a public interface for an Observer, which receives notifications from an Observable. It includes methods for handling next values, errors, and completion.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/util.api.md#_snippet_48

LANGUAGE: TypeScript
CODE:
```
export interface Observer<T> {
    complete: CompleteFn;
    error: ErrorFn;
    next: NextFn<T>;
}
```

--------------------------------

TITLE: QueryCompositeFilterConstraint Class
DESCRIPTION: Represents a composite filter constraint for Firestore queries, indicating 'or' or 'and' logic.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/firestore.api.md#_snippet_72

LANGUAGE: APIDOC
CODE:
```
export class QueryCompositeFilterConstraint {
    readonly type: 'or' | 'and';
}
```

--------------------------------

TITLE: SafetyRating Interface
DESCRIPTION: Details a safety rating for content, including whether it was blocked, its category, probability, and severity scores.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/ai.api.md#_snippet_84

LANGUAGE: APIDOC
CODE:
```
export interface SafetyRating {
    // (undocumented)
    blocked: boolean;
    // (undocumented)
    category: HarmCategory;
    // (undocumented)
    probability: HarmProbability;
    probabilityScore: number;
    severity: HarmSeverity;
    severityScore: number;
}
```

--------------------------------

TITLE: Start Query At Value (startAt)
DESCRIPTION: Creates a QueryConstraint that includes items whose value (and optionally key) is greater than or equal to the specified value in the query results.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/database.api.md#_snippet_22

LANGUAGE: APIDOC
CODE:
```
export function startAt(value?: number | string | boolean | null, key?: string): QueryConstraint;
```

--------------------------------

TITLE: Accessing safetyRatings Property - TypeScript
DESCRIPTION: Optional property providing safety ratings for the generated content candidate.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.generatecontentcandidate.md#_snippet_7

LANGUAGE: typescript
CODE:
```
safetyRatings?: SafetyRating[];

```

--------------------------------

TITLE: Define ImagenSafetyFilterLevel Enum in TypeScript
DESCRIPTION: Defines the `ImagenSafetyFilterLevel` enumeration, which controls the aggressiveness of sensitive content filtering for image generation. This is a public preview API and should not be used in production.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/ai.md#_snippet_71

LANGUAGE: TypeScript
CODE:
```
export declare enum ImagenSafetyFilterLevel
```

--------------------------------

TITLE: ConsentStatusString Type Definition
DESCRIPTION: Defines the possible string values for a consent type, indicating whether it has been 'granted' or 'denied'.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/analytics.md#_snippet_43

LANGUAGE: APIDOC
CODE:
```
export type ConsentStatusString = 'granted' | 'denied';

Description: Whether a particular consent type has been granted or denied.
```

--------------------------------

TITLE: SOURCE_SERVER Constant
DESCRIPTION: A constant string indicating that data originated from the server.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/common/api-review/data-connect.api.md#_snippet_18

LANGUAGE: APIDOC
CODE:
```
const SOURCE_SERVER = "SERVER"
```
