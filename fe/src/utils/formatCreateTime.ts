import moment from 'moment';

export const formatCreateDate = (createAt: string) => {
  const formattedDate = moment(createAt).isAfter(moment().subtract(3, 'days'))
    ? moment(createAt).fromNow()
    : moment(createAt).format('MMMM Do YYYY, h:mm:ss a');

  return formattedDate;
};
