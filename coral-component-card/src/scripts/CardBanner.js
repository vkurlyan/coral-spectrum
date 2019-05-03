/**
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {ComponentMixin} from '../../../coral-mixin-component';
import {transform, validate} from '../../../coral-utils';

const CLASSNAME = '_coral-Banner';

/**
 Enumeration for {@link CardBanner} variants.
 
 @typedef {Object} CardBannerVariantEnum
 
 @property {String} ERROR
 A card banner to indicate that an error has occurred.
 @property {String} WARNING
 A card banner to warn the user of something important.
 @property {String} INFO
 A card banner to inform the user of non-critical information.
 */
const variant = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// An array of all possible variant classnames
const ALL_VARIANT_CLASSES = [];
for (const variantValue in variant) {
  ALL_VARIANT_CLASSES.push(`${CLASSNAME}--${variant[variantValue]}`);
}

/**
 @class Coral.Card.Banner
 @classdesc A Card Banner component
 @htmltag coral-card-banner
 @extends {HTMLElement}
 @extends {ComponentMixin}
 */
class CardBanner extends ComponentMixin(HTMLElement) {
  /** @ignore */
  constructor() {
    super();
    
    // Fetch content zones
    this._elements = {
      header: this.querySelector('coral-card-banner-header') || document.createElement('coral-card-banner-header'),
      content: this.querySelector('coral-card-banner-content') || document.createElement('coral-card-banner-content')
    };
  }
  
  /**
   The banner variant style to use. See {@link CardBannerVariantEnum}.
   
   @type {String}
   @default CardBannerVariantEnum.INFO
   @htmlattribute variant
   @htmlattributereflected
   */
  get variant() {
    return this._variant || variant.INFO;
  }
  set variant(value) {
    value = transform.string(value).toLowerCase();
    this._variant = validate.enumeration(variant)(value) && value || variant.INFO;
    this._reflectAttribute('variant', this._variant);
    
    // Remove all variant classes
    this.classList.remove(...ALL_VARIANT_CLASSES);
    
    // Set new variant class
    this.classList.add(`${CLASSNAME}--${this._variant}`);
    
    // Set the role attribute depending on the variant so that the element turns into a live region
    this.setAttribute('role', this._variant);
  }
  
  /**
   The banner's header.
   
   @type {HTMLElement}
   @contentzone
   */
  get header() {
    return this._getContentZone(this._elements.header);
  }
  set header(value) {
    this._setContentZone('header', value, {
      handle: 'header',
      tagName: 'coral-card-banner-header',
      insert: function(header) {
        this.insertBefore(header, this.firstChild);
      }
    });
  }
  
  /**
   The banner's content.
   
   @type {HTMLElement}
   @contentzone
   */
  get content() {
    return this._getContentZone(this._elements.content);
  }
  set content(value) {
    this._setContentZone('content', value, {
      handle: 'content',
      tagName: 'coral-card-banner-content',
      insert: function(content) {
        this.appendChild(content);
      }
    });
  }
  
  get _contentZones() {
    return {
      'coral-card-banner-header': 'header',
      'coral-card-banner-content': 'content'
    };
  }
  
  /**
   Returns {@link CardBanner} variants.
   
   @return {CardBannerVariantEnum}
   */
  static get variant() { return variant; }
  
  /** @ignore */
  static get observedAttributes() {
    return ['variant'];
  }
  
  /** @ignore */
  connectedCallback() {
    super.connectedCallback();
    
    this.classList.add(CLASSNAME);
  
    // Default reflected attributes
    if (!this._variant) { this.variant = variant.INFO; }
    
    const header = this._elements.header;
    const content = this._elements.content;
  
    // When the content zone was not created, we need to make sure that everything is added inside it as a content.
    if (!content.parentNode) {
      while (this.firstChild) {
        const child = this.firstChild;
        
        // Don't move header into content
        if (child === header) {
          child.remove();
        }
        else {
          content.appendChild(this.firstChild);
        }
      }
    }
    
    // Assign content zones
    this.header = this._elements.header;
    this.content = this._elements.content;
  }
}

export default CardBanner;
