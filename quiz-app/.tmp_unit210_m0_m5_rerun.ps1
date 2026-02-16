$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3000'

function PostJson([string]$url, [hashtable]$body) {
  $json = $body | ConvertTo-Json -Depth 20
  return Invoke-RestMethod -Uri $url -Method POST -ContentType 'application/json' -Body $json
}

$runsCtx = Invoke-RestMethod -Uri "$base/api/admin/module/runs?unit=210" -Method GET
$versionId = $runsCtx.defaultSyllabusVersionId
$create = PostJson "$base/api/admin/module/runs" @{ syllabusVersionId = $versionId; unit = '210'; chatTranscript = 'Unit 210 full pipeline invariant verification rerun' }
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
  chatTranscript = 'Unit 210 full pipeline invariant verification rerun'
  replayFromArtifacts = $false
}

$m0 = PostJson "$base/api/admin/module/$runId/m0-distill" $m0Req
$m1 = PostJson "$base/api/admin/module/$runId/m1-analyze" @{ replayFromArtifacts = $false }
$m2 = PostJson "$base/api/admin/module/$runId/m2-coverage" @{ replayFromArtifacts = $false }
$m3 = PostJson "$base/api/admin/module/$runId/m3-plan" @{ replayFromArtifacts = $false }
$m4 = PostJson "$base/api/admin/module/$runId/m4-blueprints" @{ replayFromArtifacts = $false }
$m5 = PostJson "$base/api/admin/module/$runId/m5-validate" @{ replayFromArtifacts = $false }
$summary = Invoke-RestMethod -Uri "$base/api/admin/module/runs/$runId" -Method GET

$storedM4 = $summary.artifacts | Where-Object { $_.stage -eq 'M4' } | Select-Object -First 1
$storedM5 = $summary.artifacts | Where-Object { $_.stage -eq 'M5' } | Select-Object -First 1

$out = [ordered]@{
  runId = $runId
  m1UnitTitle = $m1.artifact.unitTitle
  m1SourceChunkCounts = ($m1.artifact.los | ForEach-Object { [ordered]@{ lo=$_.lo; count=$_.sourceChunkIds.Count } })
  m2AcCountByLo = ($m2.artifact.los | ForEach-Object { [ordered]@{ lo=$_.lo; count=$_.coverageTargets.Count } })
  m3LessonCountByLo = ($m3.artifact.los | ForEach-Object { [ordered]@{ lo=$_.lo; lessonCount=$_.lessonCount; lessons=$_.lessons.Count } })
  m4GeneratedBy = ($storedM4.artifact_json.loBlueprintSets | ForEach-Object { [ordered]@{ lo=$_.lo; generatedBy=$_.generatedBy } })
  m5Valid = $m5.artifact.valid
  m5IssueCodes = ($m5.artifact.issues | ForEach-Object { "$($_.severity):$($_.code):$($_.meta.lo)" })
}
$out | ConvertTo-Json -Depth 20
