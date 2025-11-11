class ActiveRecordValidationApp {
  constructor() {
    this.validationHelpers = [];
    this.filteredHelpers = [];
    this.currentView = "cards"; // cards, list
    this.selectedCategories = new Set(); // selected categories for toggle behavior
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadValidationHelpers();
    this.updateDropdownText();
    this.render();
  }

  bindEvents() {
    const searchInput = document.getElementById("search");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const themeToggle = document.getElementById("theme-toggle");
    const viewButtons = document.querySelectorAll(".view-btn");
    const dropdownToggle = document.getElementById("dropdown-toggle");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const dropdownCheckboxes = document.querySelectorAll(
      '.dropdown-item input[type="checkbox"]',
    );

    searchInput.addEventListener(
      "input",
      this.debounce(() => this.filterHelpers(), 300),
    );

    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setCategoryFilter(
          e.target.closest(".category-btn").dataset.category,
        );
      });
    });

    // Dropdown functionality
    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener("click", () => {
        dropdownMenu.classList.toggle("show");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".category-dropdown")) {
          dropdownMenu.classList.remove("show");
        }
      });

      // Handle checkbox changes
      dropdownCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
          this.setCategoryFilter(e.target.dataset.category);
        });
      });
    }

    themeToggle.addEventListener("click", () => this.toggleTheme());

    viewButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setView(e.target.closest(".view-btn").dataset.view);
      });
    });

    // Initialize theme
    this.initTheme();
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  async loadValidationHelpers() {
    try {
      this.showLoading();
      // Use the validation helpers data directly
      this.validationHelpers = this.getValidationHelpersData();
      this.filteredHelpers = [...this.validationHelpers];

      this.updateLastUpdated(new Date().toISOString());
      this.hideLoading();
    } catch (error) {
      this.showError(error.message);
    }
  }

  getValidationHelpersData() {
    return [
      {
        name: "validates_presence_of",
        category: "Presence",
        description: "Ensures that the specified attributes are not empty",
        syntax: "validates_presence_of :attribute_name",
        options: [
          { name: "message", description: "Custom error message" },
          { name: "on", description: "Specify context (:create or :update)" },
          { name: "if", description: "Condition to perform validation" },
          { name: "unless", description: "Condition to skip validation" },
        ],
        example: `class User < ApplicationRecord
  validates_presence_of :name, :email
end

# Or using the newer syntax:
class User < ApplicationRecord
  validates :name, :email, presence: true
end`,
        url: "https://api.rubyonrails.org/classes/ActiveModel/Validations/HelperMethods.html#method-i-validates_presence_of",
      },
      {
        name: "validates_absence_of",
        category: "Presence",
        description: "Ensures that the specified attributes are absent/empty",
        syntax: "validates_absence_of :attribute_name",
        options: [
          { name: "message", description: "Custom error message" },
          { name: "on", description: "Specify context (:create or :update)" },
          { name: "if", description: "Condition to perform validation" },
          { name: "unless", description: "Condition to skip validation" },
        ],
        example: `class User < ApplicationRecord
  validates_absence_of :guest_token
end

# Or using the newer syntax:
class User < ApplicationRecord
  validates :guest_token, absence: true
end`,
        url: "https://api.rubyonrails.org/classes/ActiveModel/Validations/HelperMethods.html#method-i-validates_absence_of",
      },
      {
        name: "validates_length_of",
        category: "Length",
        description: "Validates the length of the specified attributes",
        syntax: "validates_length_of :attribute_name, options",
        options: [
          { name: "minimum", description: "Minimum length" },
          { name: "maximum", description: "Maximum length" },
          { name: "in", description: "Length must be in range" },
          { name: "is", description: "Exact length" },
          { name: "within", description: "Alias for :in" },
          { name: "message", description: "Custom error message" },
          { name: "too_long", description: "Message when too long" },
          { name: "too_short", description: "Message when too short" },
          { name: "wrong_length", description: "Message when wrong length" },
        ],
        example: `class User < ApplicationRecord
  validates_length_of :name, minimum: 2, maximum: 50
  validates_length_of :bio, maximum: 500
end

# Or using the newer syntax:
class User < ApplicationRecord
  validates :name, length: { minimum: 2, maximum: 50 }
  validates :bio, length: { maximum: 500 }
end`,
        url: "https://api.rubyonrails.org/classes/ActiveModel/Validations/HelperMethods.html#method-i-validates_length_of",
      },
      {
        name: "validates_numericality_of",
        category: "Numerical",
        description: "Validates that the specified attributes are numeric",
        syntax: "validates_numericality_of :attribute_name, options",
        options: [
          { name: "only_integer", description: "Only allow integers" },
          {
            name: "greater_than",
            description: "Value must be greater than specified",
          },
          {
            name: "greater_than_or_equal_to",
            description: "Value must be greater than or equal to specified",
          },
          { name: "equal_to", description: "Value must equal specified" },
          {
            name: "less_than",
            description: "Value must be less than specified",
          },
          {
            name: "less_than_or_equal_to",
            description: "Value must be less than or equal to specified",
          },
          { name: "other_than", description: "Value must not equal specified" },
          { name: "odd", description: "Value must be odd" },
          { name: "even", description: "Value must be even" },
          { name: "message", description: "Custom error message" },
        ],
        example: `class Product < ApplicationRecord
  validates_numericality_of :price, greater_than: 0
  validates_numericality_of :quantity, only_integer: true, greater_than: 0
end

# Or using the newer syntax:
class Product < ApplicationRecord
  validates :price, numericality: { greater_than: 0 }
  validates :quantity, numericality: { only_integer: true, greater_than: 0 }
end`,
        url: "https://api.rubyonrails.org/classes/ActiveModel/Validations/HelperMethods.html#method-i-validates_numericality_of",
      },
      {
        name: "validates_inclusion_of",
        category: "Inclusion",
        description:
          "Validates that the specified attributes are included in a given set",
        syntax: "validates_inclusion_of :attribute_name, in: array",
        options: [
          { name: "in", description: "Array of allowed values" },
          { name: "message", description: "Custom error message" },
          { name: "if", description: "Condition to perform validation" },
          { name: "unless", description: "Condition to skip validation" },
        ],
        example: `class User < ApplicationRecord
  validates_inclusion_of :role, in: %w[user admin moderator]
  validates_inclusion_of :status, in: 1..5
end

# Or using the newer syntax:
class User < ApplicationRecord
  validates :role, inclusion: { in: %w[user admin moderator] }
  validates :status, inclusion: { in: 1..5 }
end`,
        url: "https://api.rubyonrails.org/classes/ActiveModel/Validations/HelperMethods.html#method-i-validates_inclusion_of",
      },
      {
        name: "validates_exclusion_of",
        category: "Inclusion",
        description:
          "Validates that the specified attributes are not included in a given set",
        syntax: "validates_exclusion_of :attribute_name, in: array",
        options: [
          { name: "in", description: "Array of disallowed values" },
          { name: "message", description: "Custom error message" },
          { name: "if", description: "Condition to perform validation" },
          { name: "unless", description: "Condition to skip validation" },
        ],
        example: `class User < ApplicationRecord
  validates_exclusion_of :username, in: %w[admin superuser root]
  validates_exclusion_of :email, in: -> { User.pluck(:email) }
end

# Or using the newer syntax:
class User < ApplicationRecord
  validates :username, exclusion: { in: %w[admin superuser root] }
  validates :email, exclusion: { in: -> { User.pluck(:email) } }
end`,
        url: "https://api.rubyonrails.org/classes/ActiveModel/Validations/HelperMethods.html#method-i-validates_exclusion_of",
      },
      {
        name: "validates_format_of",
        category: "Format",
        description:
          "Validates that the specified attributes match a given regular expression",
        syntax: "validates_format_of :attribute_name, with: regex",
        options: [
          { name: "with", description: "Regular expression to match" },
          { name: "without", description: "Regular expression to not match" },
          { name: "message", description: "Custom error message" },
          { name: "if", description: "Condition to perform validation" },
          { name: "unless", description: "Condition to skip validation" },
        ],
        example: `class User < ApplicationRecord
  validates_format_of :email, with: /\\A[\\w+\\-.]+@[a-z\\d\\-]+(\\.[a-z\\d\\-]+)*\\.[a-z]+\\z/i
  validates_format_of :phone, with: /\\A\\+?[\\d\\s\\-\\(\\)]+\\z/
end

# Or using the newer syntax:
class User < ApplicationRecord
  validates :email, format: { with: /\\A[\\w+\\-.]+@[a-z\\d\\-]+(\\.[a-z\\d\\-]+)*\\.[a-z]+\\z/i }
  validates :phone, format: { with: /\\A\\+?[\\d\\s\\-\\(\\)]+\\z/ }
end`,
        url: "https://api.rubyonrails.org/classes/ActiveModel/Validations/HelperMethods.html#method-i-validates_format_of",
      },
      {
        name: "validates_uniqueness_of",
        category: "Uniqueness",
        description: "Validates that the specified attributes are unique",
        syntax: "validates_uniqueness_of :attribute_name, options",
        options: [
          { name: "scope", description: "Scope to limit uniqueness check" },
          {
            name: "case_sensitive",
            description: "Whether comparison is case sensitive",
          },
          { name: "message", description: "Custom error message" },
          { name: "if", description: "Condition to perform validation" },
          { name: "unless", description: "Condition to skip validation" },
          { name: "conditions", description: "Additional SQL conditions" },
        ],
        example: `class User < ApplicationRecord
  validates_uniqueness_of :email
  validates_uniqueness_of :username, case_sensitive: false
end

class Article < ApplicationRecord
  validates_uniqueness_of :title, scope: :user_id
  validates_uniqueness_of :slug, scope: [:user_id, :category_id]
end

# Or using the newer syntax:
class User < ApplicationRecord
  validates :email, uniqueness: true
  validates :username, uniqueness: { case_sensitive: false }
end`,
        url: "https://api.rubyonrails.org/classes/ActiveRecord/Validations/ClassMethods.html#method-i-validates_uniqueness_of",
      },
      {
        name: "validates_associated",
        category: "Association",
        description: "Validates that the associated objects are valid",
        syntax: "validates_associated :association_name",
        options: [
          { name: "message", description: "Custom error message" },
          { name: "on", description: "Specify context (:create or :update)" },
          { name: "if", description: "Condition to perform validation" },
          { name: "unless", description: "Condition to skip validation" },
        ],
        example: `class Order < ApplicationRecord
  has_many :line_items
  validates_associated :line_items
end

# Or using the newer syntax:
class Order < ApplicationRecord
  has_many :line_items
  validates :line_items, associated: true
end`,
        url: "https://api.rubyonrails.org/classes/ActiveRecord/Validations/ClassMethods.html#method-i-validates_associated",
      },
      {
        name: "validates_confirmation_of",
        category: "Format",
        description:
          "Validates that the confirmation field matches the attribute",
        syntax: "validates_confirmation_of :attribute_name",
        options: [
          { name: "message", description: "Custom error message" },
          { name: "if", description: "Condition to perform validation" },
          { name: "unless", description: "Condition to skip validation" },
        ],
        example: `class User < ApplicationRecord
  validates_confirmation_of :password
  validates_confirmation_of :email
end

# Or using the newer syntax:
class User < ApplicationRecord
  validates :password, confirmation: true
  validates :email, confirmation: true
end`,
        url: "https://api.rubyonrails.org/classes/ActiveModel/Validations/HelperMethods.html#method-i-validates_confirmation_of",
      },
      {
        name: "validates_acceptance_of",
        category: "Format",
        description: "Validates that a checkbox was checked",
        syntax: "validates_acceptance_of :attribute_name",
        options: [
          { name: "accept", description: "Value that is considered accepted" },
          { name: "message", description: "Custom error message" },
          { name: "if", description: "Condition to perform validation" },
          { name: "unless", description: "Condition to skip validation" },
        ],
        example: `class User < ApplicationRecord
  validates_acceptance_of :terms_of_service
  validates_acceptance_of :privacy_policy, accept: '1'
end

# Or using the newer syntax:
class User < ApplicationRecord
  validates :terms_of_service, acceptance: true
  validates :privacy_policy, acceptance: { accept: '1' }
end`,
        url: "https://api.rubyonrails.org/classes/ActiveModel/Validations/HelperMethods.html#method-i-validates_acceptance_of",
      },
      {
        name: "validates",
        category: "Conditional",
        description:
          "General validation method that accepts multiple validation types",
        syntax: "validates :attribute_name, validation_type: options",
        options: [
          { name: "presence", description: "Attribute must be present" },
          { name: "absence", description: "Attribute must be absent" },
          { name: "length", description: "Length constraints" },
          { name: "numericality", description: "Numeric constraints" },
          { name: "inclusion", description: "Must be in specified set" },
          { name: "exclusion", description: "Must not be in specified set" },
          { name: "format", description: "Must match regex pattern" },
          {
            name: "confirmation",
            description: "Must match confirmation field",
          },
          { name: "acceptance", description: "Must be accepted" },
          { name: "uniqueness", description: "Must be unique" },
          {
            name: "associated",
            description: "Associated object must be valid",
          },
          { name: "on", description: "Specify context (:create or :update)" },
          { name: "if", description: "Condition to perform validation" },
          { name: "unless", description: "Condition to skip validation" },
          { name: "allow_nil", description: "Skip validation if value is nil" },
          {
            name: "allow_blank",
            description: "Skip validation if value is blank",
          },
          { name: "message", description: "Custom error message" },
          {
            name: "strict",
            description: "Raise exception on validation failure",
          },
        ],
        example: `class User < ApplicationRecord
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :email, presence: true, format: { with: /\\A[\\w+\\-.]+@[a-z\\d\\-]+(\\.[a-z\\d\\-]+)*\\.[a-z]+\\z/i }
  validates :age, numericality: { greater_than: 0 }, allow_nil: true
  validates :terms_of_service, acceptance: true, on: :create
  validates :admin_role, inclusion: { in: %w[user admin] }, if: :account_active?
end`,
        url: "https://api.rubyonrails.org/classes/ActiveModel/Validations/ClassMethods.html#method-i-validates",
      },
      {
        name: "conditional",
        category: "Conditional",
        description:
          "Apply validations conditionally using :if and :unless options",
        syntax: "validates :attribute, validation: { if: condition }",
        options: [
          {
            name: "if",
            description: "Symbol, string, or proc - validation runs when true",
          },
          {
            name: "unless",
            description: "Symbol, string, or proc - validation runs when false",
          },
          {
            name: "on",
            description: "Run validation only on :create or :update",
          },
        ],
        example: `class User < ApplicationRecord
  # Symbol - calls method
  validates :email, presence: true, if: :requires_email?
  
  # String - evaluates in context of instance
  validates :phone, presence: true, if: "mobile_user?"
  
  # Proc - evaluates with self as argument
  validates :company, presence: true, if: ->(user) { user.business_account? }
  
  # Unless - opposite of if
  validates :guest_token, absence: true, unless: :guest_user?
  
  # On - only run on specific context
  validates :password, confirmation: true, on: :create
  validates :current_password, presence: true, on: :update
end`,
        url: "https://guides.rubyonrails.org/active_record_validations.html#conditional-validation",
      },
    ];
  }

  filterHelpers() {
    const searchTerm = document.getElementById("search").value.toLowerCase();

    this.filteredHelpers = this.validationHelpers.filter((helper) => {
      const matchesSearch =
        !searchTerm ||
        helper.name.toLowerCase().includes(searchTerm) ||
        helper.description.toLowerCase().includes(searchTerm) ||
        helper.category.toLowerCase().includes(searchTerm);

      // Match if no categories selected or helper's category is in selected set
      const matchesCategory =
        this.selectedCategories.size === 0 ||
        this.selectedCategories.has(helper.category);

      return matchesSearch && matchesCategory;
    });

    this.render();
  }

  setCategoryFilter(category) {
    // Toggle individual category
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }

    // Update button states
    const button = document.querySelector(
      `.category-btn[data-category="${category}"]`,
    );
    if (button) {
      button.classList.toggle("active");
    }

    // Update checkbox states
    const checkbox = document.querySelector(
      `.dropdown-item input[data-category="${category}"]`,
    );
    if (checkbox) {
      checkbox.checked = this.selectedCategories.has(category);
    }

    // Update dropdown text
    this.updateDropdownText();

    this.filterHelpers();
  }

  updateDropdownText() {
    const dropdownText = document.getElementById("dropdown-text");
    if (!dropdownText) return;

    if (this.selectedCategories.size === 0) {
      dropdownText.textContent = "Select Categories";
    } else if (this.selectedCategories.size === 1) {
      dropdownText.textContent = Array.from(this.selectedCategories)[0];
    } else {
      dropdownText.textContent = `${this.selectedCategories.size} Categories Selected`;
    }
  }

  render() {
    this.renderValidationHelpers();
    this.addCopyEventListeners();
    // Apply syntax highlighting after rendering
    this.applySyntaxHighlighting();
  }

  addCopyEventListeners() {
    const copyButtons = document.querySelectorAll(
      ".copy-btn, .terminal-copy-btn",
    );

    copyButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const syntax = btn.dataset.syntax;
        this.copyToClipboard(syntax, btn);
      });
    });
  }

  setView(view) {
    // Only allow cards or list views
    if (view !== "cards" && view !== "list") {
      view = "cards"; // Default to cards view if invalid view is provided
    }

    this.currentView = view;

    // Update active button
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    const activeBtn = document.querySelector(`[data-view="${view}"]`);
    if (activeBtn) {
      activeBtn.classList.add("active");
    }

    this.render();
  }

  renderValidationHelpers() {
    const container = document.getElementById("validation-helpers");

    if (this.filteredHelpers.length === 0) {
      container.innerHTML = `
                <div class="no-results">
                    <p>No validation helpers found matching your criteria.</p>
                </div>
            `;
      return;
    }

    switch (this.currentView) {
      case "cards":
        container.innerHTML = this.filteredHelpers
          .map((helper) => this.createValidationHelperCard(helper))
          .join("");
        container.className = "validation-helpers-grid";
        break;
      case "list":
        container.innerHTML = this.filteredHelpers
          .map((helper) => this.createValidationHelperListItem(helper))
          .join("");
        container.className = "validation-helpers-list";
        break;
    }
  }

  createValidationHelperCard(helper) {
    const categoryClass = helper.category.toLowerCase().replace(" ", "-");

    return `
            <div class="validation-helper-card ${categoryClass}" data-helper-name="${helper.name}">
                <div class="validation-helper-header">
                    <div class="validation-helper-name">
                        ${helper.name}
                        <a href="${helper.url}" target="_blank" rel="noopener" class="validation-helper-name-link" aria-label="View documentation">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                            <path fill="var(--comment)" d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"></path>
                          </svg>
                        </a>
                    </div>
                    <div class="validation-helper-category ${categoryClass}">${helper.category}</div>
                </div>
                <div class="validation-helper-description">${helper.description}</div>
                <div class="terminal-prompt">
                    <div class="terminal-prompt-content">
                        <span class="terminal-prompt-prefix">#</span>
                        <span class="terminal-prompt-command"><code class="language-ruby">${helper.syntax}</code></span>
                    </div>
                    <button class="terminal-copy-btn" data-syntax="${helper.syntax}" aria-label="Copy syntax">
                        <svg aria-hidden="true" focusable="false" class="octicon octicon-copy" viewBox="0 0 16 16" width="14" height="14" fill="currentColor" display="inline-block" overflow="visible">
                            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                            <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                        </svg>
                    </button>
                </div>
                <div class="validation-helper-options">
                    <h4>Options:</h4>
                    <div class="options-list">
                        ${helper.options
                          .map(
                            (option) => `
                            <div class="validation-helper-option">
                                <strong>${option.name}:</strong> ${option.description}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
                <div class="validation-helper-example">
                    <h4>Example:</h4>
                    <pre><code class="language-ruby">${this.escapeHtml(helper.example)}</code></pre>
                </div>
            </div>
        `;
  }

  createValidationHelperListItem(helper) {
    const categoryClass = helper.category.toLowerCase().replace(" ", "-");

    return `
            <div class="validation-helper-list-item ${categoryClass}">
                <div class="validation-helper-list-name">
                    ${helper.name}
                    <a href="${helper.url}" target="_blank" rel="noopener" class="validation-helper-name-link" aria-label="View documentation">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                        <path fill="var(--comment)" d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"></path>
                      </svg>
                    </a>
                </div>
                <div class="validation-helper-list-info">
                    <div class="validation-helper-list-description">${helper.description}</div>
                    <div class="terminal-prompt">
                        <div class="terminal-prompt-content">
                            <span class="terminal-prompt-prefix">#</span>
                            <span class="terminal-prompt-command"><code class="language-ruby">${helper.syntax}</code></span>
                        </div>
                        <button class="terminal-copy-btn" data-syntax="${helper.syntax}" aria-label="Copy syntax">
                            <svg aria-hidden="true" focusable="false" class="octicon octicon-copy" viewBox="0 0 16 16" width="14" height="14" fill="currentColor" display="inline-block" overflow="visible">
                                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  copyToClipboard(text, button) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Add a brief visual feedback
        if (button) {
          button.classList.add("copy-success");
        }

        setTimeout(() => {
          if (button) {
            button.classList.remove("copy-success");
          }
        }, 500);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }

  showLoading() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("error").style.display = "none";
    document.getElementById("validation-helpers-container").style.display =
      "none";
  }

  hideLoading() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("validation-helpers-container").style.display =
      "block";
  }

  showError(message) {
    const errorElement = document.getElementById("error");
    errorElement.textContent = message;
    errorElement.style.display = "block";
    document.getElementById("loading").style.display = "none";
    document.getElementById("validation-helpers-container").style.display =
      "none";
  }

  showSuccess(message) {
    // Create a temporary success message
    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;
    successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--green);
            color: var(--bg);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            max-width: 90vw;
            word-wrap: break-word;
        `;

    document.body.appendChild(successDiv);

    // Remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 3000);
  }

  updateLastUpdated(timestamp) {
    if (!timestamp) return;

    // Parse ISO-8601 UTC timestamp and display it in ISO-8601 UTC format
    const date = new Date(timestamp);
    const iso8601UTC = date.toISOString();

    document.getElementById("footer-updated").textContent = iso8601UTC;
  }

  initTheme() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.body.classList.contains("light-theme")
      ? "light"
      : "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    const body = document.body;
    const themeIcon = document.getElementById("theme-icon");

    if (theme === "light") {
      body.classList.add("light-theme");
      themeIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
      themeIcon.classList.remove("sun");
      themeIcon.classList.add("moon");
    } else {
      body.classList.remove("light-theme");
      themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
      themeIcon.classList.remove("moon");
      themeIcon.classList.add("sun");
    }

    // Save theme preference
    localStorage.setItem("theme", theme);
  }

  applySyntaxHighlighting() {
    // Apply Prism highlighting to all code blocks
    if (typeof Prism !== "undefined") {
      Prism.highlightAll();
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Add CSS dynamically
const style = document.createElement("style");
style.textContent = `
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem 1rem;
        color: var(--comment);
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new ActiveRecordValidationApp();
});
