
export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const countries = ['UGANDA', 'U.A.E', 'U.S.A', 'U.K', 'KENYA']



export const formatDate = (date) => {
  if (!date) {
    console.error('Invalid date:', date);
    return 'Invalid Date';
  }
  const d = new Date(date);
  if (isNaN(d)) {
    console.error('Invalid date object:', date);
    return 'Invalid Date';
  }
  return d.toISOString().split('T')[0];
};
export const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23

