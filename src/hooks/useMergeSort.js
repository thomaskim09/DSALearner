import { useState, useCallback } from 'react';

export const useMergeSort = () => {
  const [history, setHistory] = useState([]);

  const sort = useCallback((array) => {
    let historyArr = [];
    let arr = [...array];

    // Initial row
    historyArr.push({
      array: [...arr],
      message: 'Initial unsorted array.',
      highlights: {}
    });

    function merge(left, mid, right) {
      // If this merge operates on a 3-length segment, insert a pre-merge
      // "third-element highlight" row that is identical to the previous row.
      if ((right - left + 1) === 3) {
        const prevState = historyArr[historyArr.length - 1].array;
        const thirdIndex = left + 2;
        historyArr.push({
          array: [...prevState],
          message: `Highlight third element (${prevState[thirdIndex]}) in merged range ${left}-${right}.`,
          highlights: { singleHighlight: thirdIndex }
        });
      }

      // Perform the actual merge
      const leftHalf = arr.slice(left, mid + 1);
      const rightHalf = arr.slice(mid + 1, right + 1);

      let i = 0, j = 0, k = left;

      while (i < leftHalf.length && j < rightHalf.length) {
        if (leftHalf[i] <= rightHalf[j]) {
          arr[k] = leftHalf[i++];
        } else {
          arr[k] = rightHalf[j++];
        }
        k++;
      }

      while (i < leftHalf.length) arr[k++] = leftHalf[i++];
      while (j < rightHalf.length) arr[k++] = rightHalf[j++];

      // Record the merged range row
      historyArr.push({
        array: [...arr],
        message: `Merged sub-arrays to form the sorted range from index ${left} to ${right}.`,
        highlights: { mergedRange: [left, right] }
      });
    }

    function recursiveSort(left, right) {
      if (left >= right) return;
      const mid = Math.floor((left + right) / 2);
      recursiveSort(left, mid);
      recursiveSort(mid + 1, right);
      merge(left, mid, right);
    }

    recursiveSort(0, arr.length - 1);

    // Final "sorted" state (reuse last row if identical)
    if (historyArr[historyArr.length - 1].array.join(',') !== arr.join(',')) {
      historyArr.push({ array: [...arr], message: 'Array is fully sorted.', highlights: { sorted: true } });
    } else {
      historyArr[historyArr.length - 1].message = 'Array is fully sorted.';
      historyArr[historyArr.length - 1].highlights = { sorted: true };
    }

    setHistory(historyArr);
  }, []);

  return { history, sort };
};
