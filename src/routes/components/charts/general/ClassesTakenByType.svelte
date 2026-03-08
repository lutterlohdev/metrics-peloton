<script>
  import {classesTakenByType} from "$lib/store/store";
</script>

<section>
  <div class="section-wrapper">
    <h2>Classes Taken By Type</h2>
    <ul class="list-wrapper">
      {#each $classesTakenByType as classType}
        <li class="chart-value">
          {classType.type}
          <span>{classType.count}</span>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  section {
    background: #048ba8ff;
    color: #fff;
  }
  .list-wrapper {
    padding: 0;
    margin: 0 40px;
  }
  .chart-value {
    background: #fff;
    color: #048ba8ff;
    font-size: 16px;
    padding: 1em 1.4em;
    line-height: 24px;
    margin-bottom: 10px;
  }
  span {
    font-weight: 100;
    font-size: 24px;
    float: right;
  }
  @media only screen and (min-width: 768px) {
    .list-wrapper {
      column-count: 2;
      column-gap: 20px;
    }
  }
</style>
