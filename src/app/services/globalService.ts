
export class Globals {
    public static ServiceUri: string;
    public static TopBottomAnimationDuration: number;
    public static ResetTurnafterDrop: number;
    public static WinningPoint: number;
    public static LosingPoint: number;
    public static PanningScale: number;
    public static setGlobals(config: any) {
        Globals.ServiceUri = config.ServiceUri;
        Globals.TopBottomAnimationDuration = config.TopBottomAnimationDuration;
        Globals.ResetTurnafterDrop = config.ResetTurnafterDrop;
        Globals.WinningPoint = config.WinningPoint;
        Globals.LosingPoint = config.LosingPoint;
        Globals.PanningScale = config.PanningScale;
    }
}