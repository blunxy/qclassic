require 'test_helper'

class PagesControllerTest < ActionController::TestCase
  test "should get scanner" do
    get :scanner
    assert_response :success
  end

  test "should get pricer" do
    get :pricer
    assert_response :success
  end

  test "should get displayer" do
    get :displayer
    assert_response :success
  end

end
