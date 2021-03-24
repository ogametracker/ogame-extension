import bottomLevelKeys from '../utils/bottomLevelKeys';
import de from './de';
import settings from './settings';

const extension = bottomLevelKeys({ 
    de 
});
export default {
    ...extension,
    settings,
};