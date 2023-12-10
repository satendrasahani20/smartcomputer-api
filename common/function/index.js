exports.calculatePercentage=(data) =>{
    const { obtainedScore, maxMark } = data;
    if (typeof obtainedScore === 'number' && typeof maxMark === 'number' && maxMark !== 0) {
      const percentage = (obtainedScore / maxMark) * 100;
      return percentage.toFixed(2); // Keep the result as a string with 2 decimal places
    } else {
      return 'Invalid input';
    }
  }

 