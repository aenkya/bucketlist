import { Item } from './item';


export interface Bucketlist {
    id: number;
    name: string;
    description: string;
    date_created: Date;
    date_modified: Date;
    created_by: number;
    items: Item[];
}
