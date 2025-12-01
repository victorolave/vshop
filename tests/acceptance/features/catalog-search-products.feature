Feature: Product Search
  As a buyer
  I want to search for products by text
  So that I can quickly find what I'm interested in

  Scenario: Search with results
    Given I am on the home page
    When I type "iphone" in the search box
    And I submit the search
    Then the page should switch to Search mode
    And I should see a list of products
    And each product should display title, price, and image

  Scenario: Search without results
    Given I am on the home page
    When I type "xyz123abc" in the search box
    And I submit the search
    Then I should see a message indicating there are no results
    And I should see a suggestion to modify the search

  Scenario: Search error with retry
    Given I am on the home page
    When I type "error" in the search box
    And I submit the search
    Then I should see an error message
    And I should see a Retry button
    When I click the Retry button
    Then the search should be retried

