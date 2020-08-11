import React, { useState, useEffect, useContext } from 'react';
import { HeaderContext } from 'AmericanHunt/components/HeaderProvider'
import { Elements } from 'react-stripe-elements';
import { Redirect } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid } from '@material-ui/core';
import checkoutPageStyles from '../CheckoutPage/checkoutPageStyles';
import PropertyDetail from 'AmericanHunt/components/PropertyDetail/PropertyDetail'
import { connect } from 'react-redux';
import LegalConditions from './components/LegalConditions/LegalConditions';
import ReceiptTable from './components/ReceiptTable';
import DebCredPicker from './components/DebCredPicker/DebCredPicker';
import ConfirmResModal from './components/ConfirmResModal/ConfirmResModal';



const CheckoutPage = ({ classes, stripeCustomerInfo, pendingReservation, ...rest }) => {

  const [cardSelected, handleCardSelect] = useState(false);
  const [checkBoxes, handleCheckBox] = useState({
    cancellation: false,
    termsAndCond: false
  }); 
  const { setHeight } = useContext(HeaderContext)

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    setHeight(80)
  }, [setHeight]);

  if(!pendingReservation) return <Redirect to='/' />

  let { propertyInfo, reservedBy: currentRes } = pendingReservation
  let { stripeCustomerInfo: { allSources = [] }, loading } = stripeCustomerInfo

  let isButtonDisabled = checkBoxes.cancellation && checkBoxes.termsAndCond && cardSelected && !loading;

  return (
    <div className={classes.pageHeader} >
      <Elements>
        <Grid container className={classes.resConfirmWrapper}>
          <Grid container direction='column'>
            <PropertyDetail property={propertyInfo} />
            <LegalConditions {...{classes, checkBoxes, handleCheckBox}} />
            <ReceiptTable {...{classes,propertyInfo,currentRes}} /> 
            <DebCredPicker {...{classes,allSources,handleCardSelect,loading}} />
          </Grid>
          <div className={classes.modalWrapper}>
            <ConfirmResModal 
              isButtonDisabled={!isButtonDisabled} 
              history={rest.history} 
              classes={classes}
            />
          </div>
        </Grid>
      </Elements>
    </div>
  ) 
};

const mapStateToProps = ({ 
    stripe: stripeCustomerInfo, 
    properties: { pendingReservation }}) => 
  ({
    stripeCustomerInfo,
    pendingReservation  
  });

export default connect(mapStateToProps)(withStyles(checkoutPageStyles)(CheckoutPage))