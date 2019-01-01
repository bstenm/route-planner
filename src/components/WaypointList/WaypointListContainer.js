import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WaypointList from './WaypointList';
import { removeWaypoint, sortWaypoints } from '../../actions/waypoints';

export class WaypointListContainer extends React.Component {
      state = { draggedOnId: null };

      onDragStart = e => {
            e.dataTransfer.setData('text/plain', e.target.id);
      };

      onDragOver = e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            // the id for the item being dragged on is set to last item if
            // dragging inside dropzone but outside the waypoint list
            let { id } = e.target;
            id = id || id === '0' ? id : this.props.waypointList.length - 1;
            id = parseInt(id, 10);

            if (this.state.draggedOnId !== id) {
                  this.setState({ draggedOnId: id });
            }
      };

      onDrop = e => {
            e.preventDefault();

            this.setState({ draggedOnId: null });

            const draggedId = e.dataTransfer.getData('text/plain');

            // the id of the item on which we drop the dragged item.
            // if dropping outside the list we simulate dropping on last item
            const droppedOnId =
                  e.target.id || this.props.waypointList.length - 1;

            // do nothing if we drop item into itself
            if (draggedId === droppedOnId) return;

            // dispatch action
            this.props.sortWaypoints({ draggedId, droppedOnId });
      };

      render() {
            return (
                  <WaypointList
                        waypointList={this.props.waypointList}
                        removeWaypoint={this.props.removeWaypoint}
                        draggedOnId={this.state.draggedOnId}
                        onDragOver={this.onDragOver}
                        onDragStart={this.onDragStart}
                        onDrop={this.onDrop}
                  />
            );
      }
}

WaypointListContainer.defaultProps = {
      waypointList: [],
};

WaypointListContainer.propTypes = {
      waypointList: PropTypes.arrayOf(PropTypes.array.isRequired),
      sortWaypoints: PropTypes.func.isRequired,
      removeWaypoint: PropTypes.func.isRequired,
};

export default connect(
      ({ waypointList }) => ({ waypointList }),
      { removeWaypoint, sortWaypoints },
)(WaypointListContainer);
