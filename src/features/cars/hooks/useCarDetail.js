import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarById } from '../carsSlice';
import { getCarRentalRate, getCarFeedback, getBookingById, getUserById, getDistanceBetweenAddresses } from '../carApi';

export const useCarDetail = (carId) => {
  const dispatch = useDispatch();
  const [rentalRate, setRentalRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackUsers, setFeedbackUsers] = useState({});
  const [deliveryDistance, setDeliveryDistance] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(60000);
  const [loadingDistance, setLoadingDistance] = useState(false);

  // Get car data from Redux store
  const { currentCar, loading, error } = useSelector((state) => state.cars);

  // Fetch car by ID on component mount
  useEffect(() => {
    if (carId) {
      dispatch(fetchCarById(carId));
    }
  }, [dispatch, carId]);

  // Fetch rental rate when car ID changes
  useEffect(() => {
    const fetchRentalRate = async () => {
      if (!carId) return;

      setLoadingRate(true);
      try {
        const rateData = await getCarRentalRate(carId);
        setRentalRate(rateData);
      } catch (error) {
        console.error('Failed to fetch rental rate:', error);
      } finally {
        setLoadingRate(false);
      }
    };

    fetchRentalRate();
  }, [carId]);

  // Fetch feedback when car ID changes
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!carId) return;

      setLoadingFeedback(true);
      try {
        const feedbackData = await getCarFeedback(carId);
        const feedbackArray = Array.isArray(feedbackData) ? feedbackData : [];
        setFeedbacks(feedbackArray);

        // Fetch user data for each feedback
        const usersData = {};
        for (const feedback of feedbackArray) {
          if (feedback.bookingId && !usersData[feedback.bookingId]) {
            try {
              const bookingData = await getBookingById(feedback.bookingId);

              if (!bookingData) {
                usersData[feedback.bookingId] = {
                  username: 'Người dùng',
                  avatar: null
                };
                continue;
              }

              const userId = bookingData?.userId || bookingData?.customerId;
              if (userId) {
                const userData = await getUserById(userId);

                if (!userData) {
                  usersData[feedback.bookingId] = {
                    username: 'Người dùng',
                    avatar: null
                  };
                  continue;
                }

                usersData[feedback.bookingId] = {
                  username: userData.username || 'Người dùng',
                  avatar: userData.imageAvatar || null
                };
              } else {
                usersData[feedback.bookingId] = {
                  username: 'Người dùng',
                  avatar: null
                };
              }
            } catch (error) {
              console.error(`Failed to fetch user data for booking ${feedback.bookingId}:`, error);
              usersData[feedback.bookingId] = {
                username: 'Người dùng',
                avatar: null
              };
            }
          }
        }
        setFeedbackUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
        setFeedbacks([]);
      } finally {
        setLoadingFeedback(false);
      }
    };

    fetchFeedback();
  }, [carId]);

  return {
    currentCar,
    loading,
    error,
    rentalRate,
    loadingRate,
    feedbacks,
    loadingFeedback,
    feedbackUsers,
    deliveryDistance,
    setDeliveryDistance,
    deliveryFee,
    setDeliveryFee,
    loadingDistance,
    setLoadingDistance
  };
};