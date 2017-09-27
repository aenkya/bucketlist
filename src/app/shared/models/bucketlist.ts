import { Item } from './item';


export interface Bucketlist {
    id: number;
    name: string;
    date_created: Date;
    date_modified: Date;
    created_by: number;
    item: Item[];
}
