$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3000'

function PostJson([string]$url, [hashtable]$body) {
  $json = $body | ConvertTo-Json -Depth 20
  return Invoke-RestMethod -Uri $url -Method POST -ContentType 'application/json' -Body $json
}

$runsCtx = Invoke-RestMethod -Uri "$base/api/admin/module/runs?unit=210" -Method GET
$versionId = $runsCtx.defaultSyllabusVersionId
$create = PostJson "$base/api/admin/module/runs" @{ syllabusVersionId = $versionId; unit = '210'; chatTranscript = 'Unit 210 full pipeline invariant verification' }
$runId = $create.run.id

$m0Req = @{
  syllabusVersionId = $versionId
  unit = '210'
  selectedLos = @('LO1','LO2','LO3')
  constraints = @{
    minimiseLessons = $false
    defaultMaxLessonsPerLO = 9
    maxAcsPerLesson = 4
    preferredAcsPerLesson = 2
    maxLessonsOverrides = @{}
    level = 'Level 2'
    audience = 'beginner'
  }
  orderingPreference = 'foundation-first'
  notes = ''
  chatTranscript = 'Unit 210 full pipeline invariant verification'
  replayFromArtifacts = $false
}

$m0 = PostJson "$base/api/admin/module/$runId/m0-distill" $m0Req
$m1 = PostJson "$base/api/admin/module/$runId/m1-analyze" @{ replayFromArtifacts = $false }
$m2 = PostJson "$base/api/admin/module/$runId/m2-coverage" @{ replayFromArtifacts = $false }
$m3 = PostJson "$base/api/admin/module/$runId/m3-plan" @{ replayFromArtifacts = $false }
$m4 = PostJson "$base/api/admin/module/$runId/m4-blueprints" @{ replayFromArtifacts = $false }
$m5 = PostJson "$base/api/admin/module/$runId/m5-validate" @{ replayFromArtifacts = $false }
$summary = Invoke-RestMethod -Uri "$base/api/admin/module/runs/$runId" -Method GET

$result = [ordered]@{ runId = $runId; versionId = $versionId; m0=$m0; m1=$m1; m2=$m2; m3=$m3; m4=$m4; m5=$m5; summary=$summary }
$result | ConvertTo-Json -Depth 100
