import React from 'react';
import loadjs from 'loadjs';
import PropTypes from 'prop-types';
import cf from '../../config';
import log from '../../services/Log';

export class LeafletApiLoaderContainer extends React.Component {
      state = {
            Leaflet: null,
            leafletError: null,
      };

      componentDidMount() {
            const { js, css } = cf.mapLib;
            loadjs([css.endPoint, js.endPoint], {
                  // fetch in parallel and load them in series
                  async: false,
                  // add integrity and crossorigin attributes
                  before: (path, scriptEl) => {
                        scriptEl.crossOrigin = '';
                        if (path === js.endPoint) {
                              scriptEl.integrity = js.integrity;
                        }
                        if (path === css.endPoint) {
                              scriptEl.integrity = css.integrity;
                        }
                  },
                  // get the map api from the window on success
                  success: () => {
                        this.setState({
                              Leaflet: window.L,
                              leafletError: null,
                        });
                  },
                  error: () => {
                        const leafletError = 'Could not load the map';
                        log.error(leafletError);
                        this.setState({
                              leafletError,
                              Leaflet: null,
                        });
                  },
            });
      }

      render() {
            return this.props.children(this.state);
      }
}

LeafletApiLoaderContainer.propTypes = {
      children: PropTypes.func.isRequired,
};

export default LeafletApiLoaderContainer;
