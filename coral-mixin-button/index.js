import './src/styles/index.css';

import ButtonMixin from './src/scripts/ButtonMixin';
import {mixin} from '../coral-utils';

// Expose mixin on Coral namespace
mixin._button = ButtonMixin;

export {ButtonMixin};