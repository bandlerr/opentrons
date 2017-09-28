import React from 'react'
import classnames from 'classnames'
import styles from './PipetteConfig.css'

export default function PipetteConfig (props) {
  const {side, instruments} = props
  return (
    <section className={styles.pipette_group}>

      <div className={classnames(styles.pipette_wrapper, styles[instruments[0].axis])}>

        <div className={styles.pipette_info}>
          <button className={styles.pipette_toggle}>{side}</button>

          <h2 className={styles.title}>Pipette</h2>
          <h3>{instruments[0].channels}-Channel ({instruments[0].volume}ul) </h3>
          <h2 className={styles.title}>Suggested Tip Type</h2>
          <h3>{instruments[0].volume}ul</h3>
          <div className={styles.info}>
            <span className={styles.alert}>!</span>
            <p>For accuracy, tip dimensions must be defined using the Tip Probe tool.</p>
          </div>
          <button className={styles.btn_probe}>Prepare Pipette Tip</button>
        </div>

        <div className={styles.pipette_icon}>
          img
        </div>

      </div>

    </section>
  )
}
