export interface Item {
    id: number;
    name: string;
    date_created: Date;
    date_modified: Date;
    bucketlist_id: number;
    done: boolean;
}
