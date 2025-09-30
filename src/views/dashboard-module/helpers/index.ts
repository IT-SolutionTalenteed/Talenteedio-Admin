export const getApplicationStatus = (status: string) => {
  switch (status) {
    case 'in_review':
      return 'In review';
    case 'validated':
      return 'Validated by admin';
    case 'selected':
      return 'Selected for meeting';
    case 'hired':
      return 'Hired';
    case 'denied':
      return 'Denied';
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join(
    '/'
  );
};

export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};
