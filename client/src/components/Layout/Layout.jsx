import React from "react";


import { TransitionGroup, CSSTransition } from "react-transition-group";
import Hammer from "rc-hammerjs";



import s from "./Layout.module.scss";



import Charts from "../../pages/Charts/Charts";

class Layout extends React.Component {
  

  

  constructor(props) {
    super(props);

    
  }

  


  render() {
    return (
      <div
        className={[
          s.root,
          s.sidebarClose,
          "flatlogic-one",
          "dashboard-light",
        ].join(" ")}
        
      >
       
        <div >
         

          
            <main className={s.content}>
             
              <TransitionGroup>
                <CSSTransition
                 
                  classNames="fade"
                  timeout={200}
                >
                 <Charts/>
                </CSSTransition>
              </TransitionGroup>
            </main>
         
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default Layout;
