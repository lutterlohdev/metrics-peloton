<script>
  import {averageTotalOutputByDurationAndInstructor, cyclingData} from "$lib/store/cyclingStore";
  import {getColorBasedOnArrayLengthAndIndex, getOpacityByIndex} from "$lib/utils/colorUtils";
  import {getUniqueValuesFromDataArrayByAttribute} from "$lib/utils/dataUtils.js";
  import {activeData, activeWorkoutType} from "$lib/store/store.js";

  const uniqueInstructors = getUniqueValuesFromDataArrayByAttribute($cyclingData, "instructor");

  const getCells = (instructor) => {
    let output = "";
    const durations = Object.keys($averageTotalOutputByDurationAndInstructor);

    durations.forEach((duration, durationsIndex) => {
      const color = getColorBasedOnArrayLengthAndIndex(durations.length, durationsIndex);
      const outputs = $averageTotalOutputByDurationAndInstructor[duration];
      const index = outputs.findIndex((record) => record.instructor === instructor);
      const record = outputs[index];
      if (record) {
        const opacity = getOpacityByIndex(index);
        output +=
          '<td class="cell" data-order=' +
          index +
          ' style="background-color:' +
          color +
          "; opacity:" +
          opacity +
          '">' +
          record.averageTotalOutput +
          "</td>";
      } else {
        output += '<td class="cell"></td>';
      }
    });
    return output;
  };
</script>

<!-- Only use this for data that has output -->
{#if $activeData && $activeData.some(workout => workout.output)  && $activeWorkoutType == "Cycling"}
<section>
  <div class="section-wrapper">
    <h2>Average Total Output by Instructor</h2>
    <table cellspacing="0">
      <tbody>
      <tr>
        <td />
        {#each Object.keys($averageTotalOutputByDurationAndInstructor) as duration}
          <th>{duration} Min</th>
        {/each}
      </tr>
    </tbody>
      {#each uniqueInstructors as instructor}
        <tr>
          <th>{instructor}</th>
          {@html getCells(instructor)}
        </tr>
      {/each}
    </table>
  </div>
</section>
{/if}

<style>
  table {
    width: 100%;
  }
  th {
    text-align: left;
  }
  tr:nth-child(even) {
    background: #efefef;
  }
  tr:first-of-type > th {
    text-align: center;
  }
  tr:not(:first-of-type) > th {
    padding-left: 1em;
    font-size: 14px;
  }
  @media only screen and (max-width: 768px) {
    tr:not(:first-of-type) > th {
      font-size: 12px;
    }
  }
</style>
