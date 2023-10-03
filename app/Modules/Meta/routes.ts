import Route from '@ioc:Adonis/Core/Route'
import Config from '@ioc:Adonis/Core/Config'

// Get the organizations from the config
const organizations = Config.get('constants.meta.orgs')
const allowedImageFormats = Config.get('constants.meta.image.formats')

// Get the short names of the organizations
const shortNamesOfOrganizations = organizations.map((org) => org.short_name)

Route.group(() => {
  Route.group(() => {
    Route.get('/:meta_image', 'MetasController.index')
  }).prefix(':org_name')
}).prefix('/meta')

// Set the constraint for the org_name and meta_image route parameters
Route.where('org_name', new RegExp(`^${shortNamesOfOrganizations.join('|')}$`))
Route.where('meta_image', new RegExp(`^image(\.(${allowedImageFormats.join('|')}))?$`))
