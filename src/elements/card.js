/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import moment from 'moment';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-icons/iron-icons.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import '../shared-styles.js';

class TodoCard extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
        paper-card {
          width: 100%;
        }
        paper-menu-button {
          position: absolute;
          right: 0;
          top: 0;
        }
        .card-date {
          font-size: 14px;
          color: gray;
        }
        span.red {
          color: #E53935;
        }
      </style>

      <vaadin-dialog opened>
        <template>
          Sample dialog
        </template>
      </vaadin-dialog>

      <paper-card heading="[[info.name]]">
        <paper-menu-button>
          <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
          <paper-listbox slot="dropdown-content">
            <paper-item on-tap="_edit">Edit</paper-item>
            <paper-item on-tap="_delete"><span class="red">Delete</span></paper-item>
          </paper-listbox>
        </paper-menu-button>
        <p class="card-date">[[_prettyDate(info.dateCreated)]]</p>
        <template is="dom-if" if="[[info.description]]">
          <div class="card-content">
            <p>[[info.description]]</p>
          </div>
        </template>
      </paper-card>
    `;
  }

  static get properties() {
    return {
      info: { 
        type: Object, 
        value: { 
          name: '',
          description: '',
          priority: 0,
          dateCreated: ''
        } 
      }
    }
  }

  _edit() {
    this.$.editDialog.open()
  }

  _prettyDate(isoDate) {
    return moment(isoDate).format("MM/DD/YYYY hh:mm A")
  }
}

window.customElements.define('todo-card', TodoCard);
