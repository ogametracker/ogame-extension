export type TryActionResult<TResult, TError = undefined> = {
    success: false;
    result: TError;
} | {
    success: true;
    result: TResult;
}