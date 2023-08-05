export default class LineRanges {
    start: number;
    end: number | null = null;

    constructor(start: number);

    constructor(start: number, end?:number){
        this.start = start;
        this.end = this.end ? this.end : null;
    }

    public getStart(): number{
        return this.start;
    }

    public getEnd(): number|null{
        return this.end;
    }

    public setStart(start: number){
        this.start = start;
    }

    public setEnd(end: number|null){
        this.end = end;
    }

    public printLineRange(): string{
        if(this.end == null)
            return this.start.toString();
        return this.start.toString() + "-" + this.end.toString();
    }

}