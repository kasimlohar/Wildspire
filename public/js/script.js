// Form validation module
(() => {
  'use strict';

  class FormValidator {
    constructor() {
      this.forms = document.querySelectorAll('.needs-validation');
      this.init();
    }

    init() {
      if (this.forms.length === 0) return;

      this.forms.forEach(form => {
        form.addEventListener('submit', this.handleSubmit.bind(this));
        form.addEventListener('input', this.handleRealTimeValidation.bind(this));
        // Bind the change event handler to the instance
        form.addEventListener('change', this.handleRealTimeValidation.bind(this));
      });
    }

    handleSubmit(event) {
      const form = event.target;
      
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
      this.showCustomValidationMessages(form);
    }

    handleRealTimeValidation(event) {
      const input = event.target;
      // Updated to allow input, textarea, and select elements for validation.
      if (!['input', 'textarea', 'select'].includes(input.tagName.toLowerCase())) return;
      
      input.checkValidity() ? 
        this.clearCustomError(input) : 
        this.showCustomError(input);
    }

    showCustomValidationMessages(form) {
      form.querySelectorAll(':invalid').forEach(input => {
        this.showCustomError(input);
      });
    }

    showCustomError(input) {
      const fieldName = input.getAttribute('data-field-name') || 
                        input.name.split('[').pop().replace(']', '');
      const message = this.getValidationMessage(input, fieldName);
      this.displayError(input, message);
      
      // Add shake animation
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
    }

    getValidationMessage(input, fieldName) {
      const messages = {
        valueMissing: `Please provide a ${fieldName}`,
        patternMismatch: `Invalid ${fieldName} format`,
        rangeUnderflow: `Minimum ${fieldName} is ${input.min}`,
        rangeOverflow: `Maximum ${fieldName} is ${input.max}`,
        customError: input.validationMessage
      };

      return messages[Object.keys(messages).find(key => input.validity[key])];
    }

    displayError(input, message) {
      const errorContainer = input.parentElement.querySelector('.invalid-feedback');
      if (errorContainer) {
        errorContainer.textContent = message;
      }
    }

    clearCustomError(input) {
      const errorContainer = input.parentElement.querySelector('.invalid-feedback');
      if (errorContainer) {
        errorContainer.textContent = '';
      }
    }
  }

  // Initialize form validation
  document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
  });

})();

// Add this to your script for interactive star rating
document.addEventListener('DOMContentLoaded', function() {
    const starLabels = document.querySelectorAll('.star-label');
    
    starLabels.forEach(label => {
        label.addEventListener('mouseover', function() {
            const rating = this.previousElementSibling.value;
            highlightStars(rating);
        });
        
        label.addEventListener('mouseout', function() {
            const checkedInput = document.querySelector('.star-input:checked');
            const rating = checkedInput ? checkedInput.value : 0;
            highlightStars(rating);
        });
    });

    function highlightStars(rating) {
        starLabels.forEach(label => {
            const starValue = label.previousElementSibling.value;
            label.classList.toggle('active', starValue <= rating);
        });
    }
});

// Activity filtering and sorting
document.addEventListener('DOMContentLoaded', () => {
    const activityCards = document.querySelectorAll('.row.row-cols-1 > .col');
    
    // Difficulty filtering
    document.querySelectorAll('[name="difficulty-filter"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const filter = e.target.id.replace('filter-', '');
            
            activityCards.forEach(card => {
                const badgeElement = card.querySelector('.badge');
                const difficulty = badgeElement ? badgeElement.textContent.trim().toLowerCase() : '';
                
                if (filter === 'all' || difficulty === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Price sorting
    document.getElementById('sort-price-asc')?.addEventListener('click', () => {
        sortActivities('asc');
    });
    
    document.getElementById('sort-price-desc')?.addEventListener('click', () => {
        sortActivities('desc');
    });
    
    function sortActivities(order) {
        const container = document.querySelector('.row.row-cols-1');
        const cards = Array.from(activityCards);
        
        cards.sort((a, b) => {
            const priceTextA = a.querySelector('.text-muted')?.textContent || '0';
            const priceTextB = b.querySelector('.text-muted')?.textContent || '0';
            
            const priceA = parseFloat(priceTextA.replace(/[^0-9.]/g, '')) || 0;
            const priceB = parseFloat(priceTextB.replace(/[^0-9.]/g, '')) || 0;
            
            return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
        
        cards.forEach(card => container.appendChild(card));
    }
});