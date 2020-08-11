import React, { useEffect, useReducer, useContext } from 'react';
import { connect } from 'react-redux'
import { HeaderContext } from 'AmericanHunt/components/HeaderProvider'
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Parallax from 'assets/components/Parallax/Parallax.jsx';
import { propDeetsStyles } from './propertyDetailsPageStyles'
import PropertyInfo from './components/PropertyInfo';
import { setPendingReservation } from 'reduxStore/actions/propertyActions'
import { PropDetailCtx, initState, reducer } from './context/PropDeetsCtx'
import { checkDates, transformResDates } from 'utility/utility';


const PropertyDetails = ({ classes, properties, match, ...props }) => { 
  
  const [state, dispatch] = useReducer(reducer, initState)
  const { setHeight } = useContext(HeaderContext)

  const { property, propertyError, resStart, resEnd } = state

  useEffect(() => { setHeight(245) }, [setHeight])

  useEffect(() => {
    if(properties.length){
      const propertyId = match.params.id
      let [currentProperty] = properties.filter(({ key }) => key === propertyId )
      dispatch({ type: 'PROPERTY_FOUND', currentProperty })
    } else {
      dispatch({ type: 'PROPERTY_NOT_FOUND' })
    }
  }, [properties, match])

  useEffect(() => {
    if(resStart && resEnd){
      let { resDates, unavailableDates } = property
      let unavailableDays = transformResDates(resDates,unavailableDates);
      const { error } = checkDates(resStart, resEnd, unavailableDays)
      error ? dispatch({ type: 'CAL_ERROR', error }) : dispatch({ type: 'NO_CAL_ERROR' })
    }
  }, [resStart, resEnd, property])

  return (
    <div>
      <Parallax image={require('assets/img/bg2.jpg')} filter='dark' className={classes.parallax} />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          { property && !propertyError && 
            <PropDetailCtx.Provider 
              value={{ 
                state,
                dispatch,
                classes,
                user: props.user,
                history: props.history,
                setPendingReservation: props.setPendingReservation 
              }}
            >
              <PropertyInfo /> 
            </PropDetailCtx.Provider>
          }
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ 
  properties: { properties },
  user: { user } 
}) => ({ properties, user }) 

const mapDispatchToProps = (dispatch) => ({
  setPendingReservation: (details) => dispatch(setPendingReservation(details))
});

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(
  withStyles(propDeetsStyles)(PropertyDetails)
);
