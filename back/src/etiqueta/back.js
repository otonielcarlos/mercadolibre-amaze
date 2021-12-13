
    // Function to find the maximum index difference.
  function  maxIndexDiff(arr, n)
    {
        if(n==1){
            return 0;
        }
        let maxDiff = 2; 
        let {j , i } = 0
      
        let LMin = new Array(n);
        let RMax = new Array(n);
      
        //Constructing LMin[] such that LMin[i] stores the minimum value 
        //from (arr[0], arr[1], ... arr[i]).
        LMin[0] = arr[0]; 
        for (i = 1; i < n; ++i) 
            LMin[i] = Math.min(arr[i], LMin[i-1]); 
      
        //Constructing RMax[] such that RMax[j] stores the maximum value 
        //from (arr[j], arr[j+1], ..arr[n-1]). 
        RMax[n-1] = arr[n-1]; 
        for (j = n-2; j >= 0; --j) 
            RMax[j] = Math.max(arr[j], RMax[j+1]); 
      
     //   i = 0, j = 0, maxDiff = 2; 
        //Traversing both arrays from left to right to find optimum j-i. 
        //This process is similar to merge() of MergeSort.
        while (j < n && i < n) 
        { 
            if (LMin[i] <= RMax[j]) 
            { 
                //Updating the maximum difference.
                maxDiff = Math.max(maxDiff, j-i); 
                j = j + 1; 
            } 
            else
                i = i+1; 
        } 
        //returning the maximum difference.
        console.log(maxDiff)
        console.log(i,j)
        return maxDiff; 
    }

    maxIndexDiff([2,1,1,2],4)
    maxIndexDiff([3,1,4,2],4)