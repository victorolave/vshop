Feature: AI Product Insights & Advisor
  As a user browsing product details
  I want to see AI-generated insights about products
  So that I can make informed purchase decisions quickly

  Background:
    Given I am on a product detail page

  # User Story 1: View AI-generated product summary with creative visual design (P1)
  @us1 @p1 @summary
  Scenario: Display AI-generated product summary with visual design
    Given the AI service is available
    When the page loads successfully
    Then I should see an "AI Insights" section
    And the section should contain a brief summary in natural language
    And the summary should be concise (2-4 sentences)
    And the summary should be enhanced with visual design elements
    And the layout should be mobile-first optimized

  @us1 @p1 @summary @mobile
  Scenario: Summary section is optimized for mobile viewing
    Given the AI service is available
    And I am viewing on a mobile device (width <= 768px)
    When the page loads successfully
    Then the AI Insights summary should have appropriate font sizes
    And the spacing should be optimized for touch
    And visual elements should be appropriately sized for small screens

  # User Story 2: Understand product strengths and weaknesses (P1)
  @us2 @p1 @pros-cons
  Scenario: Display pros and cons with visual design elements
    Given the AI service is available
    When the page loads successfully
    Then I should see a "Pros" section with product strengths
    And each pro should have visual design elements (icons, color coding)
    And I should see a "Cons" section with product weaknesses
    And cons should have different visual treatment from pros
    And each item should be concise (one short phrase)

  @us2 @p1 @expandable
  Scenario: Expandable sections work correctly on desktop
    Given the AI service is available
    And I am viewing on a desktop device (width >= 769px)
    When the page loads successfully
    Then the pros and cons sections should be expanded by default

  @us2 @p1 @expandable @mobile
  Scenario: Expandable sections are collapsed on mobile
    Given the AI service is available
    And I am viewing on a mobile device (width <= 768px)
    When the page loads successfully
    Then the pros and cons sections should be collapsed by default
    And I should be able to tap to expand each section

  # User Story 3: Receive personalized product recommendations (P1)
  @us3 @p1 @recommendations
  Scenario: Display recommendation badges with visual elements
    Given the AI service is available
    And the product has recommendation data
    When the page loads successfully
    Then I should see 1-3 recommendation badges
    And each badge should have icons or visual indicators
    And badges should represent user types or use cases

  @us3 @p1 @recommendations @interactive
  Scenario: Recommendation badges provide interactive feedback
    Given the AI service is available
    And recommendation badges are displayed
    When I hover or tap on a recommendation badge
    Then I should see immediate visual feedback (color change, animation)
    And the interaction state should be clearly indicated

  # User Story 4: Accessible and engaging interface (P1)
  @us4 @p1 @accessibility @keyboard
  Scenario: All interactive elements are keyboard accessible
    Given the AI service is available
    And AI insights are displayed
    When I navigate using only keyboard (Tab, Enter, Arrow keys)
    Then all interactive elements should be focusable
    And focus indicators should be clearly visible
    And I should be able to operate all elements without mouse

  @us4 @p1 @accessibility @screen-reader
  Scenario: Content is accessible to screen readers
    Given the AI service is available
    And AI insights are displayed
    When I navigate using a screen reader
    Then all content should be properly announced
    And ARIA labels should describe interactive elements
    And semantic HTML should provide clear structure

  @us4 @p1 @accessibility @motion
  Scenario: Animations respect user motion preferences
    Given the AI service is available
    And I have enabled "prefers-reduced-motion" setting
    When AI insights content appears or updates
    Then animations should be reduced or disabled
    And content should still be functional

  @us4 @p1 @touch
  Scenario: Touch targets meet minimum size requirements
    Given the AI service is available
    And AI insights are displayed
    When I view on a touch device
    Then all interactive elements should be at least 44x44 pixels
    And elements should be appropriately spaced

  @us4 @p1 @feedback
  Scenario: Interactive elements provide immediate feedback
    Given the AI service is available
    And AI insights are displayed
    When I interact with any interactive element
    Then I should receive visual feedback within 100ms
    And the feedback should clearly indicate the interaction occurred

  # User Story 5: Graceful handling when AI is unavailable (P2)
  @us5 @p2 @graceful-degradation
  Scenario: Product page works when AI service fails
    Given the AI service is unavailable
    When the page loads
    Then the product detail should display all standard information
    And the AI Insights section should be hidden
    And no error messages should be exposed to the user
    And the page layout should remain intact

  @us5 @p2 @graceful-degradation @timeout
  Scenario: Product page works when AI service times out
    Given the AI service takes longer than 5 seconds to respond
    When the page loads
    Then the product detail should display normally
    And the AI Insights section should be hidden after timeout
    And no error messages should be shown

  @us5 @p2 @graceful-degradation @rate-limit
  Scenario: Product page works when rate limit is exceeded
    Given the rate limit for AI calls has been exceeded
    When the page loads
    Then the product detail should display normally
    And the AI Insights section should be hidden
    And no rate limit error should be exposed to the user

  @us5 @p2 @graceful-degradation @missing-key
  Scenario: Product page works when API key is not configured
    Given the OPENAI_API_KEY environment variable is not set
    When the page loads
    Then the product detail should display normally
    And the AI Insights section should be hidden
    And no configuration error should be exposed to the user
    And a warning should be logged server-side

  # Loading States
  @loading
  Scenario: Display skeleton loading state while insights are being generated
    Given the AI service is available
    And insights are being generated
    When I view the product detail page
    Then I should see a skeleton/placeholder in the AI Insights section
    And the skeleton should mimic the final content structure
    And product information should be displayed immediately

  # Edge Cases
  @edge-case @malformed-response
  Scenario: Handle malformed AI response gracefully
    Given the AI service returns malformed data
    When the page loads
    Then the product detail should display normally
    And the AI Insights section should be hidden
    And no error details should be exposed

  @edge-case @partial-data
  Scenario: Handle products with limited information
    Given the product has minimal specifications
    And the AI service is available
    When the page loads
    Then the AI service should attempt to generate insights
    Or gracefully indicate insufficient data
    And the product detail should remain functional

