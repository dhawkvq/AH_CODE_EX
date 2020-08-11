import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { HeaderContext } from 'AmericanHunt/components/HeaderProvider';
import NotificationBar from 'AmericanHunt/components/NotificationBar/NotificationBar';
import InfoPlaceholder from 'AmericanHunt/components/InfoPlaceholder/InfoPlaceholder';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import GridContainer from 'assets/components/Grid/GridContainer.jsx';
import Parallax from 'assets/components/Parallax/Parallax.jsx';
import homePageStyles from './HomePageStyles';
import { mobOrNot, today, twentyDaysFromDate } from 'utility/utility';
import PropertyCard from 'AmericanHunt/components/PropertyCard/PropertyCard';
import { mobileNotification, setMessageDisplay } from 'reduxStore/actions/mobileActions'
import { updateFilter, resetFilters } from 'reduxStore/actions/filterActions';
import { filterProperties } from 'reduxStore/actions/propertyActions';
import Quadrant from './components/Quadrant';
import Murica from './components/Murica';
import './components/styles/nav.scss'
import GameSelect from './components/GameSelect';
import FlyFiltering from './components/FlyFiltering';

const HomePage = ({ classes, filters, filteredProperties, updateFilter, resetFilters, properties, filterProperties, mobileNotif, ...rest }) => {

  const [fade, setFade] = useState(false);
  const { setHeight } = useContext(HeaderContext);

  const mobile = mobOrNot(navigator.userAgent) === 'mobile'
  const { notificationTime, messageDisplayed } = mobileNotif
  const { setMessageDisplay, mobileNotification } = rest


  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    setHeight(120);
  }, [setHeight]);

  useEffect(() => {
    if(mobile){
      if(!notificationTime || today > twentyDaysFromDate(notificationTime)){
        mobileNotification(today)
      }
    }
  }, [mobileNotification, notificationTime, mobile])

  useEffect(() => {
    if (!messageDisplayed && mobile) {
      let timer = setTimeout(setMessageDisplay, 20000);
      return () => clearTimeout(timer);
    }
  }, [messageDisplayed,mobile,setMessageDisplay])

  useEffect(() => {
    if (filters.state || filters.activity || filters.game ){
      if(properties.length){
        filterProperties(properties, filters);
      }
    }
  }, [filters, filterProperties, properties]);


  const handleFade = ({ animationName }) => {
    if (animationName === 'fadeOut') {
      resetFilters();
      setFade(false);
    }
  };


  return (
    <div>
      <Parallax image={require('assets/img/bg8.jpg')} filter='dark'>
        {!messageDisplayed && mobile && (
          <NotificationBar notification={{ type: 'browser', error: 'mobile' }} handleClose={setMessageDisplay} />
        )}
        <GridContainer direction='column' className={classes.gridContainer}>
          <h1>
            Providing outdoor enthusiasts <br />
            more access to land
          </h1>
          <div className={ mobile ? 'filter--mobile' : 'filter' }>
            {!filters.activity ? (
                <Quadrant {...{ updateFilter }} />
            ) : filters.activity === 'Hunting' && !filters.game ? (
                <GameSelect {...{ updateFilter }}  />
            ) : !filters.state ? (
                <Murica {...{ updateFilter, filters, resetFilters, mobile }} />
            ) : null }
          </div>  
        </GridContainer>
      </Parallax>
      {filters.state && (
        <div className={fade ? 'propsContainer--fade' : 'propsContainer'} onAnimationEnd={handleFade}>
          <div className={classNames(classes.main, classes.mainRaised)}>
            <FlyFiltering {...{ filters, updateFilter, setFade }}/>
            <div className={classes.propertyDetailCont}>
              <GridContainer justify='center'>
                {filteredProperties.length ? (
                  filteredProperties.map((property,idx) => <PropertyCard key={idx} {...{ property }} />)
                ) : (
                  <InfoPlaceholder label={'noPropertiesYet'} />
                )}
              </GridContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ 
  filters,
  mobileNotif, 
  properties: { properties, filteredProperties } 
}) => 
({ properties, filteredProperties, filters, mobileNotif });

const mapDispatchToProps = (dispatch) => ({
  updateFilter: (state) => dispatch(updateFilter(state)),
  resetFilters: () => dispatch(resetFilters()),
  filterProperties: (properties, filters) => dispatch(filterProperties(properties, filters)),
  mobileNotification: (time) => dispatch(mobileNotification(time)),
  setMessageDisplay: () => dispatch(setMessageDisplay())
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(homePageStyles)(HomePage));
