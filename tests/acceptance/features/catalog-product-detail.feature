Feature: Product Detail View

  As a user
  I want to see detailed information about a product
  So that I can decide whether to purchase it

  Scenario: Successfully viewing product details
    Given I am on the product detail page for product "MLA123456789"
    When the product data loads successfully
    Then I should see the product title "Apple iPhone 13 (128 GB) - Medianoche"
    And I should see the price "$ 1.367.999"
    And I should see the product image
    And I should see the product attributes including "Marca", "Modelo"
    And I should see the product description
    And I should see the "Comprar ahora" button

  Scenario: Product loading state
    Given I navigate to product "MLA123456789"
    When the product data is being fetched
    Then I should see a skeleton loading animation
    And I should not see the error message

  Scenario: Product not found
    Given I attempt to view a non-existent product "MLA999999999"
    When the server returns a 404 Not Found error
    Then I should see a "Producto no encontrado" message
    And I should see a button to return to the catalog

  Scenario: Server error handling
    Given I attempt to view product "error" which triggers a server error
    When the server returns a 500 Internal Server Error
    Then I should see an "Error al cargar el producto" message
    And I should see a "Reintentar" button

  Scenario: Hero Animation transition
    Given I am on the search results page
    When I click on a product card
    Then the product image should animate smoothly to the detail view position
    And the product details should fade in

