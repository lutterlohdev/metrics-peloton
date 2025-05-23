<script>
  import {averageTotalOutputByDurationAndInstructor, workoutData} from "$lib/store/workoutStore";
  import {getColorBasedOnArrayLengthAndIndex, getOpacityByIndex} from "$lib/utils/colorUtils";
  import {getUniqueValuesFromDataArrayByAttribute} from "$lib/utils/dataUtils.js";
  import {activeData, activeWorkoutType} from "$lib/store/store.js";

  const uniqueInstructors = getUniqueValuesFromDataArrayByAttribute($workoutData, "Instructor Name");

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


<!-- Defensive: Only show chart if data is a non-empty array with output -->
{#if Array.isArray($activeData) && $activeData.length > 0 && $activeData.some(workout => workout.output)}
  {#if Object.keys($averageTotalOutputByDurationAndInstructor).length > 0 && Array.isArray(uniqueInstructors) && uniqueInstructors.length > 0}
    <section>
      <div class="section-wrapper">
        <h2>Average Total Output by Instructor</h2>
        <table cellspacing="0">
          <thead>
            <tr>
              <td />
              {#each Object.keys($averageTotalOutputByDurationAndInstructor) as duration}
                <th>{duration} Min</th>
              {/each}
            </tr>
          </thead>
          <tbody>
          {#each uniqueInstructors as instructor}
            <tr>
              <th>{instructor}</th>
              {@html getCells(instructor)}
            </tr>
          {/each}
          </tbody>
        </table>
      </div>
    </section>
  {/if}
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
