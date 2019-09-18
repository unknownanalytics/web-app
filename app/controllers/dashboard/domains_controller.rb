module Dashboard
  class DomainsController < Dashboard::DashboardController
    before_action :verify_current_domain_selected
    before_action :verify_current_domain_selected, except: [:index, :new, :create]
    before_action :verify_current_user_own_domain, except: [:index, :new, :create]


    # GET /domains
    # GET /domains.json
    def index
      @domain = Domain.new
      @domains = current_user.own_domains.all
    end

    # GET /settings
    def settings
      @domain_setting = DomainSetting.where(domain_id: current_domain.id).first_or_create
      if request.get?

      else
        @domain_setting.update(domain_setting_params)
      end
    end

    # GET /domains/1
    # GET /domains/1.json
    def show
    end

    # GET /domains/new
    def new
      @domain = Domain.new
    end

    # GET /domains/1/edit
    def edit
    end

    # POST /domains
    # POST /domains.json
    def create
      @domain = Domain.new(domain_params)
      @domain.user = current_user
      respond_to do |format|
        if @domain.save
          format.html {redirect_to dashboard_domains_path, notice: t('Domain was successfully created.')}
          format.json {render :show, status: :created, location: @domain}
        else
          format.html {render :new}
          format.json {render json: @domain.errors, status: :unprocessable_entity}
        end
      end
    end

    # PATCH/PUT /domains/1
    # PATCH/PUT /domains/1.json
    def update
      respond_to do |format|
        if @domain.update(domain_params)
          format.html {redirect_to @domain, notice: 'Domain was successfully updated.'}
          format.json {render :show, status: :ok, location: @domain}
        else
          format.html {render :edit}
          format.json {render json: @domain.errors, status: :unprocessable_entity}
        end
      end
    end

    # DELETE /domains/1
    # DELETE /domains/1.json
    def destroy
      @domain.destroy
      respond_to do |format|
        format.html {redirect_to dashboard_domains_url, notice: 'Domain was successfully destroyed.'}
        format.json {head :no_content}
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_domain
      @domain = Domain.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def domain_params
      params.fetch(:domain, {}).permit(:name)
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def domain_setting_params
      params.fetch(:domain_setting, {}).permit([:track_geo, :domains])
    end
  end
end