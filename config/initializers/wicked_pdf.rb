# "#{ENV['GEM_HOME']}/bin/wkhtmltopdf"
# "#{ENV['GEM_HOME']}/gems/wkhtmltopdf-binary-#{Gem.loaded_specs['wkhtmltopdf-binary'].version}/bin/wkhtmltopdf_linux_386"
# use uname (-a|-v....) to get system info info
path_to_exec = ENV['UNK_ANA_WickedPdf_EXEC_PATH']
path_to_exec = (path_to_exec.to_s.length > 0) ? path_to_exec : "#{ENV['GEM_HOME']}/bin/wkhtmltopdf"
puts "path_to_exec"
puts path_to_exec
WickedPdf.config = {
  exe_path: path_to_exec,
  temp_path: Rails.root.join('tmp')
}