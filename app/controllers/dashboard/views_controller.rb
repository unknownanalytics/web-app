class Dashboard::ViewsController < ApplicationController
  before_action :set_dashboard_view, only: [:show, :edit, :update, :destroy]

  # GET /dashboard/views
  # GET /dashboard/views.json
  def index
    @views = Dashboard::View.all
  end

  # GET /dashboard/views/1
  # GET /dashboard/views/1.json
  def show
  end

  # GET /dashboard/views/new
  def new
    @dashboard_view = Dashboard::View.new
  end

  # GET /dashboard/views/1/edit
  def edit
  end

  # POST /dashboard/views
  # POST /dashboard/views.json
  def create
    @dashboard_view = Dashboard::View.new(dashboard_view_params)

    respond_to do |format|
      if @dashboard_view.save
        format.html { redirect_to @dashboard_view, notice: 'View was successfully created.' }
        format.json { render :show, status: :created, location: @dashboard_view }
      else
        format.html { render :new }
        format.json { render json: @dashboard_view.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /dashboard/views/1
  # PATCH/PUT /dashboard/views/1.json
  def update
    respond_to do |format|
      if @dashboard_view.update(dashboard_view_params)
        format.html { redirect_to @dashboard_view, notice: 'View was successfully updated.' }
        format.json { render :show, status: :ok, location: @dashboard_view }
      else
        format.html { render :edit }
        format.json { render json: @dashboard_view.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /dashboard/views/1
  # DELETE /dashboard/views/1.json
  def destroy
    @dashboard_view.destroy
    respond_to do |format|
      format.html { redirect_to dashboard_views_url, notice: 'View was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_dashboard_view
      @dashboard_view = Dashboard::View.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def dashboard_view_params
      params.fetch(:dashboard_view, {})
    end
end
