module Dashboard
  class ApiKeysController < Dashboard::DashboardController
    before_action :set_dashboard_api_key, only: [:show, :edit, :update, :destroy]
    before_action :verify_current_domain_selected
    before_action :verify_current_user_own_domain

    # GET /dashboard/api_keys
    # GET /dashboard/api_keys.json
    def index
      @api_key = ApiKey.new
      @api_keys = current_domain.api_keys
    end

    # GET /dashboard/api_keys/1
    # GET /dashboard/api_keys/1.json
    def show
    end

    # GET /dashboard/api_keys/new
    def new
      @api_key = ApiKey.new
    end

    # GET /dashboard/api_keys/1/edit
    def edit
    end

    # POST /dashboard/api_keys
    # POST /dashboard/api_keys.json
    def create
      @api_key = ApiKey.new(dashboard_api_key_params)
      @api_key.user = current_user
      @api_key.domain = current_domain
      respond_to do |format|
        if @api_key.save
          format.html {redirect_to dashboard_domain_api_keys_path(current_domain.id), notice: 'Api key was successfully created.'}
          format.json {render :show, status: :created, location: @dashboard_api_key}
        else
          @api_keys = current_domain.api_keys
          format.html {render :index}
          format.json {render json: @dashboard_api_key.errors, status: :unprocessable_entity}
        end
      end
    end

    # PATCH/PUT /dashboard/api_keys/1
    # PATCH/PUT /dashboard/api_keys/1.json
    def update
      respond_to do |format|
        if @dashboard_api_key.update(dashboard_api_key_params)
          format.html {redirect_to @dashboard_api_key, notice: 'Api key was successfully updated.'}
          format.json {render :show, status: :ok, location: @dashboard_api_key}
        else
          format.html {render :edit}
          format.json {render json: @dashboard_api_key.errors, status: :unprocessable_entity}
        end
      end
    end

    # DELETE /dashboard/api_keys/1
    # DELETE /dashboard/api_keys/1.json
    def destroy
      @dashboard_api_key.destroy
      respond_to do |format|
        format.html {redirect_to dashboard_api_keys_url, notice: 'Api key was successfully destroyed.'}
        format.json {head :no_content}
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_dashboard_api_key
      @api_key = ApiKey.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def dashboard_api_key_params
      params.fetch(:api_key, {}).permit(:alias)
    end
  end


end
