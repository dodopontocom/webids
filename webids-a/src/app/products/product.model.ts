export interface Product {
  id: string;
  title: string;
  description: string;
  //category_id: string;
  //user_id: string;
  //date: {type: Number, default: new Date().getTime()},
  //start_bid_date: {type: Number, default: new Date().getTime()},
  imagePath: string;
  price: string;
  //bidded: {type: Boolean, default: false};
  //sold: {type: Boolean, default: false};
  creator: string;
}
