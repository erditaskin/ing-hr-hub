export interface IRoute {
  path: string;
  component: string;
  name?: string;
  redirect?: string;
  bundle?: () => Promise<any>;
  action?: () => Promise<void>;
  children?: IRoute[];
  guard?: () => Promise<boolean>;
}
