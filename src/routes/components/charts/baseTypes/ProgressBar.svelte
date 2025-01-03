<script>
  /** @type {{percentage: any, leftLabel: any, rightLabel: any, barLabel: any, fillColor: any}} */
  let {
    percentage,
    leftLabel,
    rightLabel,
    barLabel,
    fillColor
  } = $props();
</script>

<div style="color:{fillColor}">
  <span class="left-label">{leftLabel}</span>
  <span class="right-label">{rightLabel}</span>
  <div class="progress-bar-wrapper">
    <div class="progress-bar" style="width:{percentage}%; background-color:{fillColor}; color:#fff">
      {barLabel}
    </div>
  </div>
</div>

<style>
  .progress-bar-wrapper {
    width: 100%;
    height: 40px;
    background: #ddd;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  .progress-bar {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    width: 0;
    transition: 0.5s all;
    text-align: center;
    color: #222;
    font-weight: bold;
    border-radius: 4px;
  }
  .left-label,
  .right-label {
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 2px;
    display: inline-block;
  }
  .right-label {
    float: right;
  }
</style>
