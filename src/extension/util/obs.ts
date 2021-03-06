import type { Configschema } from '@/types/schemas/configschema';
import OBS from 'esa-layouts-shared/obs/extension';
import { get as nodecg } from './nodecg';

const obs = new OBS(nodecg(), (nodecg().bundleConfig as Configschema).obs);
export default obs;
