import {DotenvToolsInterface} from "./dotenv.tools.interface";
import * as dotenv from 'dotenv'
export const DotenvTools: DotenvToolsInterface = dotenv.config().parsed || {};
