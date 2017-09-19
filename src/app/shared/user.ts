export class User {
	constructor (
		public _id: string,
		public email: string,
		public first_name: string,
		public last_name: string,
		public bucketlists_url: string
	) {}
}