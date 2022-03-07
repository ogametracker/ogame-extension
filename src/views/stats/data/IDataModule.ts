export interface IDataModule {
    load(): Promise<void>;
}