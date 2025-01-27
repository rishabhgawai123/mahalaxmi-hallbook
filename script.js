document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('check-button');
    const checkForm = document.getElementById('check-booking-form');
    const bookForm = document.getElementById('book-form');
    const availabilityResult = document.getElementById('availability-result');
    const hiddenDateInput = document.getElementById('hidden-date');
  
    checkButton.addEventListener('click', () => {
      const dateInput = document.querySelector('#date');
      const date = dateInput.value;
  
      if (!date) {
        alert('Please select a date');
        return;
      }
  
      // Fetch booking information for the selected date
      fetch(`/api/bookings/${date}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch booking details');
          }
          return response.json();
        })
        .then(result => {
          if (result.booked) {
            availabilityResult.textContent = `The hall is already booked by ${result.booking.name} (${result.booking.email}).`;
            bookForm.style.display = 'none';
          } else {
            availabilityResult.textContent = 'The hall is available. You can book now!';
            bookForm.style.display = 'block';
            hiddenDateInput.value = date;
          }
        })
        .catch(err => {
          console.error(err);
          availabilityResult.textContent = 'Error checking availability. Try again later.';
        });
    });
  
    bookForm.addEventListener('submit', event => {
      event.preventDefault();
  
      const formData = new FormData(bookForm);
      const data = Object.fromEntries(formData.entries());
  
      fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(err.error);
            });
          }
          return response.json();
        })
        .then(result => {
          alert(result.message || 'Hall booked successfully!');
          window.location.reload();
        })
        .catch(err => {
          alert(`Error: ${err.message}`);
        });
    });
  });
  

