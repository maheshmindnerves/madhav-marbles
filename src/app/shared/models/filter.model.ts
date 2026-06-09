export interface FilterResponse {
    categories: Category[];
    subcategories: SubCategory[];
    items: Item[];
    colors: Color[];
    Patterns: Pattern[];
    FinishType: FinishType[];
    Applications: Application[];
    Origin: Origin[];
}

export interface Category {
    [x: string]: any;
    id: number;
    Category_Name: string;
    Category_Desc: string;
    bactive: boolean;
    checked: boolean
}

export interface SubCategory {
    id: number;
    Category_id: number;
    SubCategory_name: string;
    Isactive: boolean;
    checked: boolean
}

export interface Item {
    name: string;
    Category_id: number;
    SubCategory_Id: number;
    checked: boolean
}

export interface Color {
    color: string;
    checked: boolean
}

export interface Pattern {
    Pattern: string;
    checked: boolean
}

export interface FinishType {
    sFinishType: string;
    checked: boolean
}

export interface Application {
    Applications: string;
    checked: boolean
}

export interface Origin {
    origin: string;
    checked: boolean
}